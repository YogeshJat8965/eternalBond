const Testimonial = require('../models/Testimonial');

// Get all testimonials
exports.getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({ message: 'Failed to fetch testimonials', error: error.message });
  }
};

// Get testimonial by ID
exports.getTestimonialById = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }
    res.json(testimonial);
  } catch (error) {
    console.error('Error fetching testimonial:', error);
    res.status(500).json({ message: 'Failed to fetch testimonial', error: error.message });
  }
};

// Create new testimonial
exports.createTestimonial = async (req, res) => {
  try {
    const { name, position, company, rating, message, image } = req.body;

    if (!name || !message) {
      return res.status(400).json({ message: 'Name and message are required' });
    }

    // Generate initials from name if no image provided
    const generatedImage = image || name.split(' ').map(n => n[0]).join('');

    const testimonial = new Testimonial({
      name,
      position,
      company,
      rating: rating || 5,
      message,
      image: generatedImage
    });

    await testimonial.save();
    res.status(201).json({ message: 'Testimonial created successfully', testimonial });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    res.status(500).json({ message: 'Failed to create testimonial', error: error.message });
  }
};

// Update testimonial
exports.updateTestimonial = async (req, res) => {
  try {
    const { name, position, company, rating, message, image, isActive } = req.body;
    
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    if (name) testimonial.name = name;
    if (position) testimonial.position = position;
    if (company) testimonial.company = company;
    if (rating) testimonial.rating = rating;
    if (message) testimonial.message = message;
    if (image) testimonial.image = image;
    if (isActive !== undefined) testimonial.isActive = isActive;

    await testimonial.save();
    res.json({ message: 'Testimonial updated successfully', testimonial });
  } catch (error) {
    console.error('Error updating testimonial:', error);
    res.status(500).json({ message: 'Failed to update testimonial', error: error.message });
  }
};

// Delete testimonial
exports.deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    res.status(500).json({ message: 'Failed to delete testimonial', error: error.message });
  }
};

// Search testimonials
exports.searchTestimonials = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const testimonials = await Testimonial.find({
      isActive: true,
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { message: { $regex: query, $options: 'i' } },
        { company: { $regex: query, $options: 'i' } }
      ]
    }).sort({ createdAt: -1 });

    res.json(testimonials);
  } catch (error) {
    console.error('Error searching testimonials:', error);
    res.status(500).json({ message: 'Failed to search testimonials', error: error.message });
  }
};
