import { IBlogConfig } from '@/types';

const config: IBlogConfig = {
    mongoUrl: 'mongodb://localhost:27017/iBlog2',
    jwtSecret: 'myblogjsonwebtokensecretkey'
};

export default config;
