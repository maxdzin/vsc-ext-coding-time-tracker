"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusBar = void 0;
const vscode = require("vscode");
const utils_1 = require("./utils");
class StatusBar {
    constructor(timeTracker) {
        this.onDidClickEmitter = new vscode.EventEmitter();
        this.timeTracker = timeTracker;
        this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
        this.statusBarItem.command = 'simpleCodingTimeTracker.showSummary';
        this.statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
        this.statusBarItem.show();
        this.updateStatusBar();
        this.updateInterval = setInterval(() => this.updateStatusBar(), 1000); // Update every second
    }
    updateStatusBar() {
        const todayTotal = this.timeTracker.getTodayTotal();
        this.statusBarItem.text = `💻 ${this.formatTime(todayTotal)}`;
        this.statusBarItem.tooltip = this.getTooltipText();
    }
    formatTime(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = Math.floor(minutes % 60);
        const secs = Math.floor((minutes * 60) % 60);
        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    getTooltipText() {
        const weeklyTotal = this.timeTracker.getWeeklyTotal();
        const monthlyTotal = this.timeTracker.getMonthlyTotal();
        const allTimeTotal = this.timeTracker.getAllTimeTotal();
        return `Total Coding Time:
This week: ${(0, utils_1.formatTime)(weeklyTotal)}
This month: ${(0, utils_1.formatTime)(monthlyTotal)}
All Time: ${(0, utils_1.formatTime)(allTimeTotal)}
Click to show summary`;
    }
    onDidClick(listener) {
        return this.onDidClickEmitter.event(listener);
    }
    dispose() {
        clearInterval(this.updateInterval);
        this.statusBarItem.dispose();
        this.onDidClickEmitter.dispose();
    }
}
exports.StatusBar = StatusBar;
//# sourceMappingURL=statusBar.js.map