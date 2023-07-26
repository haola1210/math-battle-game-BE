import {
  BadRequestException,
  CACHE_MANAGER,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cache } from 'cache-manager';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { RegisterDTO } from '../auth/interfaces/register.dto';
import { LoginDTO } from '../auth/interfaces/login.dto';

@Injectable()
export default class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  testRedis(type: 'GET' | 'SET') {
    if (type === 'GET') {
      return this.cacheManager.get('data');
    }
    this.cacheManager.set('data', 'set data to redis ok');
  }

  async getUserById(id: Types.ObjectId) {
    try {
      const cachedUser = await this.cacheManager.get<UserDocument>(
        `USER_ID_${id}`,
      );

      if (cachedUser) {
        console.log('user from cache');
        return cachedUser;
      }

      const user = await this.userModel.findById(id);

      if (!user) {
        throw new NotFoundException();
      }

      console.log('user from db, cache this now');
      await this.cacheManager.set(`USER_ID_${id}`, user);

      return user;
    } catch (error) {
      throw error;
    }
  }

  async createOneUser(registerDTO: RegisterDTO) {
    try {
      const { password, ...rest } = registerDTO;
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
      const data = { password: hashedPassword, ...rest };
      const user = new this.userModel(data);
      await user.save();
      return user;
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException(JSON.stringify(error.keyValue));
      }
      throw new BadRequestException();
    }
  }

  async findAndVerify(loginDTO: LoginDTO) {
    try {
      const { username, password } = loginDTO;

      const user = await this.userModel.findOne({ username });

      if (!user) {
        throw new NotFoundException('User does not exist');
      }

      const compare = await bcrypt.compare(password, user.password);

      if (!compare) {
        throw new BadRequestException('Password is not correct');
      }

      return user;
    } catch (error) {
      throw error;
    }
  }
}
