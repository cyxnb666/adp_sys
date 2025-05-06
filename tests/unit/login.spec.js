import {
  featchDataLogin,
  featchDataLoginError,
  featchDataLoginP,
} from "./login";

//登入正确示例
// test("测试 featchDataLogin", () => {
//   featchDataLogin((data) => {
//     console.log(data, "111");
//     expect(res.data).toMatchObject({
//       success: false,
//     });
//     done();
//   });
// });

test("测试 featchDataLogin", (done) => {
  featchDataLogin().then((res) => {
    expect(res.data).toMatchObject({
      success: true,
    });
    done();
  });
});

test("测试 featchDataLoginP", (done) => {
  featchDataLoginP().then((res) => {
    expect(res.data).toMatchObject({
      success: false,
      errCode: "2000",
    });
    done();
  });
});

// //登入错误示例
// test("测试 featchDataLoginError", () => {
//   featchDataLoginError((data) => {
//     //测试data中是否包含code: 200
//     expect(data).toMatchObject({
//       code: 200,
//     });
//   });
// });
