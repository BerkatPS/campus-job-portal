import{j as e}from"./app-BUVb_nAj.js";import{c as d,u as h,B as a,T as s,a as u}from"./Button-DFxjcZ8p.js";import{c as o}from"./createLucideIcon-HVM8ksxq.js";const N=d(e.jsx("path",{d:"m22 9.24-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03zM12 15.4V6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28z"}));/**
 * @license lucide-react v0.507.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const f=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]],j=o("circle-alert",f);/**
 * @license lucide-react v0.507.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k=[["path",{d:"M12 17h.01",key:"p32p05"}],["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z",key:"1mlx9k"}],["path",{d:"M9.1 9a3 3 0 0 1 5.82 1c0 2-3 3-3 3",key:"mhlwft"}]],z=o("file-question",k);/**
 * @license lucide-react v0.507.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g=[["polyline",{points:"22 12 16 12 14 15 10 15 8 12 2 12",key:"o97t9d"}],["path",{d:"M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z",key:"oot6mr"}]],S=o("inbox",g);/**
 * @license lucide-react v0.507.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _=[["path",{d:"m13.5 8.5-5 5",key:"1cs55j"}],["path",{d:"m8.5 8.5 5 5",key:"a8mexj"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["path",{d:"m21 21-4.3-4.3",key:"1qie3q"}]],b=o("search-x",_),q=({title:l="No items found",description:m="There are no items to display at the moment.",icon:r=null,iconType:x="default",actionText:n="",onAction:c=null,sx:y={}})=>{const i=h(),p=()=>{const t=i.palette.primary.main;if(r)return r;switch(x){case"search":return e.jsx(b,{size:64,color:t});case"file":return e.jsx(z,{size:64,color:t});case"warning":return e.jsx(j,{size:64,color:t});case"default":default:return e.jsx(S,{size:64,color:t})}};return e.jsxs(a,{sx:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",py:6,px:3,...y},children:[e.jsx(a,{sx:{mb:3,display:"flex",alignItems:"center",justifyContent:"center",p:2,borderRadius:"50%",bgcolor:i.palette.primary.main+"15"},children:p()}),e.jsx(s,{variant:"h5",component:"h3",fontWeight:600,gutterBottom:!0,color:"text.primary",children:l}),e.jsx(s,{variant:"body1",color:"text.secondary",sx:{maxWidth:450,mb:n?3:0},children:m}),n&&c&&e.jsx(u,{variant:"contained",color:"primary",onClick:c,sx:{mt:2},children:n})]})};export{q as E,N as S};
