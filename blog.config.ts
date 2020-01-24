import { IBlogConfig } from '@/types';

const config: IBlogConfig = {
    mongoUrl: 'mongodb://localhost:27017/iBlog_v2',
    jwtSecret: 'myblogjsonwebtokensecretkey'
};

export default config;
