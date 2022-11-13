describe("Accumulator", function() {
    beforeEach(function() {
      sinon.stub(window, "prompt")
    });
  
    afterEach(function() {
      prompt.restore();
    });
  
    it("after trying to show preview for a .txt file, cancel", function() {
      callFunction = updateElementByExtension('.txt');
      assert.equal(callFunction, undefined);
    });
  });