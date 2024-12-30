const Label = require('../models/label.model');

// Get all labels
exports.getLabels = async (req, res) => {
  try {
    const labels = await Label.find({ user: req.user._id });
    res.json(labels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new label
exports.createLabel = async (req, res) => {
  try {
    const label = new Label({
      name: req.body.name,
      color: req.body.color,
      description: req.body.description,
      user: req.user._id
    });

    const newLabel = await label.save();
    res.status(201).json(newLabel);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update label
exports.updateLabel = async (req, res) => {
  try {
    const label = await Label.findOne({ _id: req.params.id, user: req.user._id });
    
    if (!label) {
      return res.status(404).json({ message: 'Label not found' });
    }

    if (req.body.name) label.name = req.body.name;
    if (req.body.color) label.color = req.body.color;
    if (req.body.description) label.description = req.body.description;

    const updatedLabel = await label.save();
    res.json(updatedLabel);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete label
exports.deleteLabel = async (req, res) => {
  try {
    const label = await Label.findOne({ _id: req.params.id, user: req.user._id });
    
    if (!label) {
      return res.status(404).json({ message: 'Label not found' });
    }

    await label.deleteOne();
    res.json({ message: 'Label deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get single label
exports.getLabel = async (req, res) => {
  try {
    const label = await Label.findOne({ 
      _id: req.params.id,
      user: req.user._id 
    });
    
    if (!label) {
      return res.status(404).json({ message: 'Label not found' });
    }
    
    res.json(label);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 