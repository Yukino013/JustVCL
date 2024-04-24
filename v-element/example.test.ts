// 导入了一些测试框架所需的函数和对象
import {  test, describe, vi, expect, Mocked } from 'vitest'
// 从名为 utils 的模块中导入了两个函数 
import { testFn, request } from './utils'
// 导入了 axios 库，用于进行 HTTP 请求
import axios from 'axios'
// 使用 vi 对 axios 进行模拟
vi.mock('axios')
// 断言 将axios 通过类型断言为 Mocked类型
const mockedAxios = axios as Mocked<typeof axios>
// 组织一系列相关的测试用例
describe('functions', () => {

  test('create a mock function', () => {
    const callback = vi.fn()
    testFn(15, callback)
    expect(callback).toHaveBeenCalled()
    expect(callback).toHaveBeenCalledWith(15)
  })

  test('spy on method', () => {
    const obj = {
      getName: () => 1
    }
    const spy = vi.spyOn(obj, 'getName')
    obj.getName()
    expect(spy).toHaveBeenCalled()
    obj.getName()
    expect(spy).toHaveBeenCalledTimes(2)
  })
  
  test('mock third party module', async () => {
    mockedAxios.get.mockResolvedValue({ data: 123 })
    const result = await request()
    expect(result).toBe(123)
  })
})

