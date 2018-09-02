
class BaseModel {
  constructor() {
    this.paramsError = '请求参数错误';
  }

  resolve(result) {
    return { result, error: null };
  }

  reject(error) {
    return { result: null, error: error.message };
  }
}

module.exports = BaseModel;
