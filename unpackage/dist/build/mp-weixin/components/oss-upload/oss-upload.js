(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["components/oss-upload/oss-upload"],{"17dd":function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var u=a(t("a34a"));function a(e){return e&&e.__esModule?e:{default:e}}function r(e,n,t,u,a,r,o){try{var c=e[r](o),i=c.value}catch(s){return void t(s)}c.done?n(i):Promise.resolve(i).then(u,a)}function o(e){return function(){var n=this,t=arguments;return new Promise((function(u,a){var o=e.apply(n,t);function c(e){r(o,u,a,c,i,"next",e)}function i(e){r(o,u,a,c,i,"throw",e)}c(void 0)}))}}var c={},i={name:"oss-upload",data:function(){return{action:"",formData:{},upFileName:"",headImg:""}},created:function(){c=this},methods:{beforeUpload:function(e,n){return o(u.default.mark((function e(){var t,a,r,o;return u.default.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return n[0].file,t=flie.path,e.next=4,c.$u.api.ossToken();case 4:return a=e.sent,console.log(c),c.action=a.host,console.log(c.action),r=t.slice(t.lastIndexOf(".")),o=c.$u.guid(20)+r,c.upFileName=o,c.formData={key:o,policy:a.policy,OSSAccessKeyId:a.accessid,success_action_status:"200",signature:a.signature},e.abrupt("return",!0);case 13:case"end":return e.stop()}}),e)})))()},onSuccess:function(){var e=this;return o(u.default.mark((function n(){return u.default.wrap((function(n){while(1)switch(n.prev=n.next){case 0:return e.$refs.uploadRef.remove(0),n.next=3,e.$u.api.userAvatar({avatar:e.upFileName});case 3:e.$u.utils.userInfoUpdate(),e.$u.toast("用户头像更换成功");case 5:case"end":return n.stop()}}),n)})))()}}};n.default=i},"52de":function(e,n,t){"use strict";t.d(n,"b",(function(){return a})),t.d(n,"c",(function(){return r})),t.d(n,"a",(function(){return u}));var u={uUpload:function(){return t.e("uview-ui/components/u-upload/u-upload").then(t.bind(null,"a3fe"))},uAvatar:function(){return t.e("uview-ui/components/u-avatar/u-avatar").then(t.bind(null,"33fc"))}},a=function(){var e=this,n=e.$createElement;e._self._c},r=[]},"98e0":function(e,n,t){},c4bb:function(e,n,t){"use strict";t.r(n);var u=t("52de"),a=t("da82");for(var r in a)"default"!==r&&function(e){t.d(n,e,(function(){return a[e]}))}(r);t("f9eb");var o,c=t("f0c5"),i=Object(c["a"])(a["default"],u["b"],u["c"],!1,null,"64afc5b7",null,!1,u["a"],o);n["default"]=i.exports},da82:function(e,n,t){"use strict";t.r(n);var u=t("17dd"),a=t.n(u);for(var r in u)"default"!==r&&function(e){t.d(n,e,(function(){return u[e]}))}(r);n["default"]=a.a},f9eb:function(e,n,t){"use strict";var u=t("98e0"),a=t.n(u);a.a}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'components/oss-upload/oss-upload-create-component',
    {
        'components/oss-upload/oss-upload-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('543d')['createComponent'](__webpack_require__("c4bb"))
        })
    },
    [['components/oss-upload/oss-upload-create-component']]
]);