// Mock for @react-pdf/renderer used in tests
module.exports = {
    pdf: jest.fn(() => ({
        updateContainer: jest.fn(),
        render: jest.fn(),
        toBlob: jest.fn()
    })),
    Document: 'Document',
    Page: 'Page',
    Text: 'Text',
    View: 'View',
    Image: 'Image',
    StyleSheet: {
        create: (styles) => styles // return the style object unchanged
    }
};
