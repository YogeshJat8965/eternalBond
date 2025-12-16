const Story = require('../models/Story');

// Get all stories
exports.getAllStories = async (req, res) => {
  try {
    const stories = await Story.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(stories);
  } catch (error) {
    console.error('Error fetching stories:', error);
    res.status(500).json({ message: 'Failed to fetch stories', error: error.message });
  }
};

// Get featured stories
exports.getFeaturedStories = async (req, res) => {
  try {
    const stories = await Story.find({ isActive: true, featured: true }).sort({ createdAt: -1 });
    res.json(stories);
  } catch (error) {
    console.error('Error fetching featured stories:', error);
    res.status(500).json({ message: 'Failed to fetch featured stories', error: error.message });
  }
};

// Get story by ID
exports.getStoryById = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }
    res.json(story);
  } catch (error) {
    console.error('Error fetching story:', error);
    res.status(500).json({ message: 'Failed to fetch story', error: error.message });
  }
};

// Create new story
exports.createStory = async (req, res) => {
  try {
    const { coupleName, weddingDate, story, location, image, featured } = req.body;

    if (!coupleName || !story) {
      return res.status(400).json({ message: 'Couple name and story are required' });
    }

    const newStory = new Story({
      coupleName,
      weddingDate,
      story,
      location,
      image: image || '💑',
      featured: featured || false
    });

    await newStory.save();
    res.status(201).json({ message: 'Story created successfully', story: newStory });
  } catch (error) {
    console.error('Error creating story:', error);
    res.status(500).json({ message: 'Failed to create story', error: error.message });
  }
};

// Update story
exports.updateStory = async (req, res) => {
  try {
    const { coupleName, weddingDate, story, location, image, featured, isActive } = req.body;
    
    const existingStory = await Story.findById(req.params.id);
    if (!existingStory) {
      return res.status(404).json({ message: 'Story not found' });
    }

    if (coupleName) existingStory.coupleName = coupleName;
    if (weddingDate) existingStory.weddingDate = weddingDate;
    if (story) existingStory.story = story;
    if (location) existingStory.location = location;
    if (image) existingStory.image = image;
    if (featured !== undefined) existingStory.featured = featured;
    if (isActive !== undefined) existingStory.isActive = isActive;

    await existingStory.save();
    res.json({ message: 'Story updated successfully', story: existingStory });
  } catch (error) {
    console.error('Error updating story:', error);
    res.status(500).json({ message: 'Failed to update story', error: error.message });
  }
};

// Toggle featured status
exports.toggleFeatured = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    story.featured = !story.featured;
    await story.save();
    
    res.json({ message: 'Featured status updated successfully', story });
  } catch (error) {
    console.error('Error toggling featured status:', error);
    res.status(500).json({ message: 'Failed to update featured status', error: error.message });
  }
};

// Delete story
exports.deleteStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    await Story.findByIdAndDelete(req.params.id);
    res.json({ message: 'Story deleted successfully' });
  } catch (error) {
    console.error('Error deleting story:', error);
    res.status(500).json({ message: 'Failed to delete story', error: error.message });
  }
};

// Search stories
exports.searchStories = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const stories = await Story.find({
      isActive: true,
      $or: [
        { coupleName: { $regex: query, $options: 'i' } },
        { location: { $regex: query, $options: 'i' } },
        { story: { $regex: query, $options: 'i' } }
      ]
    }).sort({ createdAt: -1 });

    res.json(stories);
  } catch (error) {
    console.error('Error searching stories:', error);
    res.status(500).json({ message: 'Failed to search stories', error: error.message });
  }
};
