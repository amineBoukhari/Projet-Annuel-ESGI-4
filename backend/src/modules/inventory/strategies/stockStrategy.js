/**
 * StockStrategy - base interface for all stock deduction strategies.
 * All strategies must implement the `execute` method.
 */
class StockStrategy {
  /**
   * Execute the stock strategy.
   * @param {object} payload - Strategy-specific data
   * @returns {Promise<void>}
   */
  async execute(payload) {
    throw new Error('StockStrategy.execute() must be implemented by subclass');
  }
}

module.exports = StockStrategy;
