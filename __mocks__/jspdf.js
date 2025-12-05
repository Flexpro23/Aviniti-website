// Simple mock for jspdf used in tests
module.exports = function Jspdf() {
    return {
        addImage: jest.fn(),
        save: jest.fn(),
        setFontSize: jest.fn(),
        text: jest.fn()
    };
};
module.exports.prototype = {
    addImage: jest.fn(),
    save: jest.fn(),
    setFontSize: jest.fn(),
    text: jest.fn()
};
