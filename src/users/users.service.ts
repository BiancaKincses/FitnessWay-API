import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { User, UserDocument } from './user.schema';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  // =========================
  // REGISTER
  // =========================
  async create(registerDto: RegisterDto) {
    const { email, password } = registerDto;

    // verificăm dacă emailul există deja
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // hash parola
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userModel.create({
      email,
      password: hashedPassword,
      role: 'user',
    });

    // NU returnăm parola
    return {
      id: user._id,
      email: user.email,
      role: user.role,
    };
  }

  // =========================
  // FIND ALL (fără parolă)
  // =========================
  async findAll() {
    return this.userModel.find().select('-password');
  }

  // =========================
  // FIND BY EMAIL (CU parolă)
  // folosit la LOGIN
  // =========================
  async findByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  // =========================
  // FIND BY ID (fără parolă)
  // =========================
  async findById(id: string) {
    return this.userModel.findById(id).select('-password -__v');
  }
}
