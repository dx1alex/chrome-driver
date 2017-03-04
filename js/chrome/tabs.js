"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("../browser/base");
class ChromeTabs extends base_1.Base {
    fullscreen() {
        return this.extension(() => {
            return fullscreen();
        });
    }
}
exports.ChromeTabs = ChromeTabs;
