"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeTracker = void 0;
const vscode = require("vscode");
class TimeTracker {
    constructor(database) {
        this.isTracking = false;
        this.startTime = 0;
        this.currentProject = '';
        this.updateInterval = null;
        this.saveInterval = null;
        this.database = database;
        this.saveIntervalSeconds = vscode.workspace
            .getConfiguration('simpleCodingTimeTracker')
            .get('saveInterval', 5);
    }
    startTracking() {
        if (!this.isTracking) {
            this.isTracking = true;
            this.startTime = Date.now();
            this.currentProject = this.getCurrentProject();
            this.updateInterval = setInterval(() => this.updateCurrentSession(), 1000);
            this.saveInterval = setInterval(() => this.saveCurrentSession(), this.saveIntervalSeconds * 1000); // Convert seconds to milliseconds
        }
    }
    stopTracking() {
        if (this.isTracking) {
            this.isTracking = false;
            if (this.updateInterval) {
                clearInterval(this.updateInterval);
                this.updateInterval = null;
            }
            if (this.saveInterval) {
                clearInterval(this.saveInterval);
                this.saveInterval = null;
            }
            this.saveCurrentSession();
        }
    }
    updateCurrentSession() {
        // This method will be called every second when tracking is active
        // You can emit an event here if you want to update the UI more frequently
    }
    saveCurrentSession() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isTracking) {
                const duration = (Date.now() - this.startTime) / 60000; // Convert to minutes
                yield this.database.addEntry(new Date(), this.currentProject, duration);
                this.startTime = Date.now(); // Reset the start time for the next interval
            }
        });
    }
    getCurrentProject() {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        return workspaceFolders ? workspaceFolders[0].name : 'Unknown Project';
    }
    getTodayTotal() {
        const today = new Date().toISOString().split('T')[0];
        const entries = this.database.getEntries();
        const todayTotal = entries
            .filter((entry) => entry.date === today)
            .reduce((sum, entry) => sum + entry.timeSpent, 0);
        // Add the current session time if tracking is active
        if (this.isTracking) {
            const currentSessionTime = (Date.now() - this.startTime) / 60000;
            return todayTotal + currentSessionTime;
        }
        return todayTotal;
    }
    getCurrentProjectTime() {
        const today = new Date().toISOString().split('T')[0];
        const currentProject = this.getCurrentProject();
        const entries = this.database.getEntries();
        const currentProjectTime = entries
            .filter((entry) => entry.date === today && entry.project === currentProject)
            .reduce((sum, entry) => sum + entry.timeSpent, 0);
        // Add the current session time if tracking is active
        if (this.isTracking && this.currentProject === currentProject) {
            const currentSessionTime = (Date.now() - this.startTime) / 60000;
            return currentProjectTime + currentSessionTime;
        }
        return currentProjectTime;
    }
    getWeeklyTotal() {
        const now = new Date();
        const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
        return this.getTotalSince(startOfWeek);
    }
    getMonthlyTotal() {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        return this.getTotalSince(startOfMonth);
    }
    getAllTimeTotal() {
        const total = this.database.getEntries()
            .reduce((sum, entry) => sum + entry.timeSpent, 0);
        // Add current session if tracking is active
        if (this.isTracking) {
            const currentSessionTime = (Date.now() - this.startTime) / 60000;
            return total + currentSessionTime;
        }
        return total;
    }
    getTotalSince(startDate) {
        const entries = this.database.getEntries();
        const startDateString = startDate.toISOString().split('T')[0];
        const now = new Date().toISOString().split('T')[0];
        const filteredEntries = entries.filter(entry => entry.date >= startDateString && entry.date <= now);
        const total = filteredEntries.reduce((sum, entry) => sum + entry.timeSpent, 0);
        // Add current session if tracking is active
        if (this.isTracking) {
            const currentSessionTime = (Date.now() - this.startTime) / 60000;
            return total + currentSessionTime;
        }
        return total;
    }
    getYearlyTotal() {
        const now = new Date();
        const startOfYear = new Date(now.getFullYear(), 0, 1); // January 1st of current year
        return this.getTotalSince(startOfYear);
    }
    dispose() {
        this.stopTracking();
    }
    resetTimer() {
        this.stopTracking();
        this.startTime = 0;
        this.database.resetTodayTime();
    }
    resetAllTimers() {
        this.stopTracking();
        this.startTime = 0;
        this.database.resetAllTime();
    }
}
exports.TimeTracker = TimeTracker;
//# sourceMappingURL=timeTracker.js.map