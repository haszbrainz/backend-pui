import * as FishService from '../services/fishService.js';

export const getAllFish = async (req, res) => {
    try {
        const fish = await FishService.getAllFish();
        res.status(200).json({ success: true, data: fish });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getFishById = async (req, res) => {
    try {
        const fish = await FishService.getFishById(req.params.id);
        res.status(200).json({ success: true, data: fish });
    } catch (error) {
        res.status(404).json({ success: false, error: error.message });
    }
};
