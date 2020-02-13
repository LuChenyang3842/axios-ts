import { AxiosInstance } from './types'
import Axios from './core/Axios'
import { extend } from './helpers/utils'

//工厂模式
// 通过这个函数创建的Axios，当直接调用axios方法，相当于执行了Axios类的request方法发送请求
function createInstance(): AxiosInstance {
  const context = new Axios() //实例化Axios
  const instance = Axios.prototype.request.bind(context) //创建instance 指向 Axios.prototype.request 方法，并绑定了上下文 context

  extend(instance, context) //把context中的原型方法和实例方法全部拷贝到instance上
  //拥有了混合对象，instance本身是个函数，又拥有了Axios类的所有原型和实例属性
  return instance as AxiosInstance
}

const axios = createInstance()

export default axios
