export class ItemStatistics {
    constructor() {
        this.totalItems = 0;
        this.totalQuantity = 0;
        this.totalValue = 0;
        this.categoriesCount = 0;
        this.categoryBreakdown = [];
    }

    toJSON() {
        return {
            totalItems: this.totalItems,
            totalQuantity: this.totalQuantity,
            totalValue: this.totalValue,
            categoriesCount: this.categoriesCount,
            categoryBreakdown: this.categoryBreakdown
        };
    }
}

export class CategoryBreakdown {
    constructor(category, count, totalQuantity, totalValue) {
        this.category = category;
        this.count = count;
        this.totalQuantity = totalQuantity;
        this.totalValue = totalValue;
    }
}