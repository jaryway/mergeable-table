module.exports = {
  transform: {
    "^.+\\.tsx?$": "ts-jest",
    "^.+\\.[t|j]sx?$": "babel-jest"
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
  transformIgnorePatterns: ["/node_modules/", "/example/"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"]
};
