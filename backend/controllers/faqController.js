const FAQ = require('../models/FAQ');

// Get all FAQs
exports.getAllFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    res.json(faqs);
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    res.status(500).json({ message: 'Failed to fetch FAQs', error: error.message });
  }
};

// Get FAQ by ID
exports.getFAQById = async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id);
    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found' });
    }
    res.json(faq);
  } catch (error) {
    console.error('Error fetching FAQ:', error);
    res.status(500).json({ message: 'Failed to fetch FAQ', error: error.message });
  }
};

// Create new FAQ
exports.createFAQ = async (req, res) => {
  try {
    const { question, answer, category, order } = req.body;

    if (!question || !answer) {
      return res.status(400).json({ message: 'Question and answer are required' });
    }

    const faq = new FAQ({
      question,
      answer,
      category: category || 'General',
      order: order || 0
    });

    await faq.save();
    res.status(201).json({ message: 'FAQ created successfully', faq });
  } catch (error) {
    console.error('Error creating FAQ:', error);
    res.status(500).json({ message: 'Failed to create FAQ', error: error.message });
  }
};

// Update FAQ
exports.updateFAQ = async (req, res) => {
  try {
    const { question, answer, category, order, isActive } = req.body;
    
    const faq = await FAQ.findById(req.params.id);
    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found' });
    }

    if (question) faq.question = question;
    if (answer) faq.answer = answer;
    if (category) faq.category = category;
    if (order !== undefined) faq.order = order;
    if (isActive !== undefined) faq.isActive = isActive;

    await faq.save();
    res.json({ message: 'FAQ updated successfully', faq });
  } catch (error) {
    console.error('Error updating FAQ:', error);
    res.status(500).json({ message: 'Failed to update FAQ', error: error.message });
  }
};

// Delete FAQ
exports.deleteFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id);
    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found' });
    }

    await FAQ.findByIdAndDelete(req.params.id);
    res.json({ message: 'FAQ deleted successfully' });
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    res.status(500).json({ message: 'Failed to delete FAQ', error: error.message });
  }
};

// Search FAQs
exports.searchFAQs = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const faqs = await FAQ.find({
      isActive: true,
      $or: [
        { question: { $regex: query, $options: 'i' } },
        { answer: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } }
      ]
    }).sort({ order: 1, createdAt: -1 });

    res.json(faqs);
  } catch (error) {
    console.error('Error searching FAQs:', error);
    res.status(500).json({ message: 'Failed to search FAQs', error: error.message });
  }
};
