import * as ArticleService from '../services/articleService.js';

export const getAllArticles = async (req, res) => {
    try {
        const articles = await ArticleService.getAllArticles();
        res.status(200).json({ success: true, data: articles });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getArticleById = async (req, res) => {
    try {
        const article = await ArticleService.getArticleById(req.params.id);
        res.status(200).json({ success: true, data: article });
    } catch (error) {
        res.status(404).json({ success: false, error: error.message });
    }
};
