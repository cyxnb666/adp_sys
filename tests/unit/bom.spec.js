import { featchBomInfo } from "./login";

test("bobInfoSelect test", (done) => {
  featchBomInfo().then((res) => {
    expect(res.data).toMatchObject({
      success: false,
    });
    done();
  });
});
