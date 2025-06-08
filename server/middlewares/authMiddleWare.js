import jwt from 'jsonwebtoken';
import Company from '../models/company.js';

export const protectCompany = async (req, res, next) => {
    let token;

    // 1. Get token from Authorization header (Bearer <token>)
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized, please log in again',
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const company = await Company.findById(decoded.id).select('-password');
        if (!company) {
            return res.status(401).json({
                success: false,
                message: 'Company not found, invalid token',
            });
        }

        req.company = company;
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Token verification failed: ' + error.message,
        });
    }
};
