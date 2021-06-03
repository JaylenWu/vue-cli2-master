import HTTP from "@/utils/http.js"

// 优惠券列表查询
export function getCouponList(pageNum, pageSize, options) {
    return HTTP({
        url: "/ht/productInfo/list/page",
        method: "get",
        params: { pageNum, pageSize, ...options }
    });
}