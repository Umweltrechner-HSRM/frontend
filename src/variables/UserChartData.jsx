import React from 'react';

class UserChartData {
    constructor(name, type, color) {
        this.name = name
        this.type = type
        this.color = color
    }

    get() {
        return {name: this.name, type: this.type, color: this.color}
    }
}
const userchartdata = new UserChartData(null,null,null)


