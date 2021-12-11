"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var express_1 = __importDefault(require("express"));
var morgan_1 = __importDefault(require("morgan"));
var path_1 = __importDefault(require("path"));
var rootDirectory = path_1.default.normalize(path_1.default.join(__dirname, '..'));
var app = (0, express_1.default)();
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.get('/mongo-dev', function (req, res) {
    res.send('this is where we will show mongo results');
});
app.use(express_1.default.static(path_1.default.join(rootDirectory, 'web-build')));
exports.default = app;
//# sourceMappingURL=express_app.js.map