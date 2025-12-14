const User = require('../models/User');

// @desc    Search members with filters
// @route   GET /api/search
// @access  Private
const searchMembers = async (req, res) => {
  try {
    const {
      gender,
      ageFrom,
      ageTo,
      religion,
      city,
      state,
      country,
      maritalStatus,
      education,
      profession,
      annualIncome,
      heightFrom,
      heightTo,
      complexion,
      foodHabits,
      motherTongue,
      caste,
      page = 1,
      limit = 12,
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;

    console.log('Search filters received:', {
      gender,
      maritalStatus,
      religion,
      city,
      profession,
      education,
      annualIncome,
      complexion,
      foodHabits
    });

    // Build query object
    const query = {
      isActive: true,
      isEmailVerified: true,
      _id: { $ne: req.user._id } // Exclude current user
    };

    // Gender filter (required - show opposite gender by default)
    if (gender) {
      query.gender = gender;
    } else {
      // If no gender specified, show opposite gender
      query.gender = req.user.gender === 'male' ? 'female' : 'male';
    }

    // Age filter
    if (ageFrom || ageTo) {
      query.dateOfBirth = {};
      if (ageFrom) {
        const dateFrom = new Date();
        dateFrom.setFullYear(dateFrom.getFullYear() - parseInt(ageFrom));
        query.dateOfBirth.$lte = dateFrom;
      }
      if (ageTo) {
        const dateTo = new Date();
        dateTo.setFullYear(dateTo.getFullYear() - parseInt(ageTo));
        query.dateOfBirth.$gte = dateTo;
      }
    }

    // Religion filter
    if (religion) {
      query.religion = religion;
    }

    // Location filters
    if (city) {
      query.city = new RegExp(city, 'i'); // Case-insensitive search
    }
    if (state) {
      query.state = new RegExp(state, 'i');
    }
    if (country) {
      query.country = country;
    }

    // Marital status filter
    if (maritalStatus) {
      query.maritalStatus = maritalStatus;
    }

    // Education filter
    if (education) {
      query.education = education;
    }

    // Profession filter
    if (profession) {
      query.profession = new RegExp(profession, 'i');
    }

    // Annual income filter
    if (annualIncome) {
      query.annualIncome = annualIncome;
    }

    // Height filter (simple string comparison for now)
    if (heightFrom || heightTo) {
      // Note: This is basic filtering. For production, convert height to cm for accurate comparison
      if (heightFrom) {
        query.height = { $gte: heightFrom };
      }
      if (heightTo) {
        query.height = { ...query.height, $lte: heightTo };
      }
    }

    // Complexion filter
    if (complexion) {
      query.complexion = complexion;
    }

    // Food habits filter
    if (foodHabits) {
      query.foodHabits = foodHabits;
    }

    // Mother tongue filter
    if (motherTongue) {
      query.motherTongue = new RegExp(motherTongue, 'i');
    }

    // Caste filter
    if (caste) {
      query.caste = new RegExp(caste, 'i');
    }

    console.log('Final query object:', JSON.stringify(query, null, 2));

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Sort
    const sortOptions = {};
    sortOptions[sortBy] = order === 'asc' ? 1 : -1;

    // Execute query
    const users = await User.find(query)
      .select('-password -verificationToken -verificationTokenExpires -resetPasswordToken -resetPasswordExpires')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination
    const total = await User.countDocuments(query);

    console.log(`Found ${total} total users, returning ${users.length} users for page ${pageNum}`);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

module.exports = {
  searchMembers
};
