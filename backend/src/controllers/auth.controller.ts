import { Request, Response } from 'express';
import jwt, { SignOptions, Secret } from 'jsonwebtoken';
import mongoose from 'mongoose';
import { User, IUser } from '../models/User';

const generateToken = (id: string): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }

  const options: SignOptions = {
    expiresIn: '30d'
  };

  return jwt.sign({ id }, secret as Secret, options);
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name,  } = req.body;

    // Email kontrolü
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Bu email adresi zaten kullanılıyor',
      });
    }

    // Yeni kullanıcı oluşturma
    const user = await User.create({
      email,
      password,
      name,
    }) as IUser;

    // Token oluşturma
    const token = generateToken(user._id.toString());

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Kayıt işlemi başarısız',
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Email ve şifre kontrolü
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Lütfen email ve şifrenizi giriniz',
      });
    }

    // Kullanıcı kontrolü
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Geçersiz email veya şifre',
      });
    }

    // Şifre kontrolü
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Geçersiz email veya şifre',
      });
    }

    // Token oluşturma
    const token = generateToken(user._id.toString());

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Giriş işlemi başarısız',
    });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user?.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Kullanıcı bilgileri alınamadı',
    });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const updates = {
      name: req.body.name,
      height: req.body.height,
      weight: req.body.weight,
      age: req.body.age,
      gender: req.body.gender,
      fitnessGoals: req.body.fitnessGoals,
      experienceLevels: req.body.experienceLevels,
      workoutDurations: req.body.workoutDurations,
      workoutLocation: req.body.workoutLocation,
    };

    console.log("updates:", updates);
    const user = await User.findByIdAndUpdate(req.user?.id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Profil güncellenemedi',
    });
  }
}; 