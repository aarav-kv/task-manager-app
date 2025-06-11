class DateLabel {
    get(inputDateStr) {
        const inputDate = new Date(inputDateStr);
        const today = new Date();
    
        // Normalize all dates to remove time component
        inputDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
    
        // Get start of this week (Monday)
        const dayOfWeek = today.getDay();
        const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        const startOfThisWeek = new Date(today);
        startOfThisWeek.setDate(today.getDate() - diffToMonday);
    
        // Start and end of last week
        const startOfLastWeek = new Date(startOfThisWeek);
        startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);
        const endOfLastWeek = new Date(startOfThisWeek);
        endOfLastWeek.setDate(endOfLastWeek.getDate() - 1);
    
        // Start and end of next week
        const startOfNextWeek = new Date(startOfThisWeek);
        startOfNextWeek.setDate(startOfNextWeek.getDate() + 7);
        const endOfNextWeek = new Date(startOfNextWeek);
        endOfNextWeek.setDate(endOfNextWeek.getDate() + 6);
    
        // Check weeks
        if (inputDate >= startOfThisWeek && inputDate <= today) return "This Week";
        if (inputDate >= startOfLastWeek && inputDate <= endOfLastWeek) return "Last Week";
        if (inputDate >= startOfNextWeek && inputDate <= endOfNextWeek) return "Next Week";
    
        // Get month and year comparisons
        const inputMonth = inputDate.getMonth();
        const inputYear = inputDate.getFullYear();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
    
        if (inputYear === currentYear && inputMonth === currentMonth) return "This Month";
        if (
            (inputYear === currentYear && inputMonth === currentMonth - 1) ||
            (inputYear === currentYear - 1 && currentMonth === 0 && inputMonth === 11)
        ) return "Last Month";
        if (
            (inputYear === currentYear && inputMonth === currentMonth + 1) ||
            (inputYear === currentYear + 1 && currentMonth === 11 && inputMonth === 0)
        ) return "Next Month";
    
        // Otherwise, return month name
        return inputDate.toLocaleString('default', { month: 'long' });
    }
    
}

export default new DateLabel();

