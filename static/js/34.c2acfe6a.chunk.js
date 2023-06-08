"use strict";(self.webpackChunkmet_museum_react=self.webpackChunkmet_museum_react||[]).push([[34],{34:function(e,t,n){n.r(t),n.d(t,{default:function(){return S}});var r=n(885),i=n(791),o=n(671),a=n(144),c=n(136),s=n(388);function l(){return l=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},l.apply(this,arguments)}var u=new Map,f=new WeakMap,d=0,h=void 0;function v(e){return Object.keys(e).sort().filter((function(t){return void 0!==e[t]})).map((function(t){return"".concat(t,"_").concat("root"===t?(n=e.root)?(f.has(n)||(d+=1,f.set(n,d.toString())),f.get(n)):"0":e[t]);var n})).toString()}function p(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:h;if("undefined"===typeof window.IntersectionObserver&&void 0!==r){var i=e.getBoundingClientRect();return t(r,{isIntersecting:r,target:e,intersectionRatio:"number"===typeof n.threshold?n.threshold:0,time:0,boundingClientRect:i,intersectionRect:i,rootBounds:i}),function(){}}var o=function(e){var t=v(e),n=u.get(t);if(!n){var r,i=new Map,o=new IntersectionObserver((function(t){t.forEach((function(t){var n,o=t.isIntersecting&&r.some((function(e){return t.intersectionRatio>=e}));e.trackVisibility&&"undefined"===typeof t.isVisible&&(t.isVisible=o),null==(n=i.get(t.target))||n.forEach((function(e){e(o,t)}))}))}),e);r=o.thresholds||(Array.isArray(e.threshold)?e.threshold:[e.threshold||0]),n={id:t,observer:o,elements:i},u.set(t,n)}return n}(n),a=o.id,c=o.observer,s=o.elements,l=s.get(e)||[];return s.has(e)||s.set(e,l),l.push(t),c.observe(e),function(){l.splice(l.indexOf(t),1),0===l.length&&(s.delete(e),c.unobserve(e)),0===s.size&&(c.disconnect(),u.delete(a))}}var g=["children","as","triggerOnce","threshold","root","rootMargin","onChange","skip","trackVisibility","delay","initialInView","fallbackInView"];function m(e){return"function"!==typeof e.children}i.Component;function y(){var e,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},n=t.threshold,o=t.delay,a=t.trackVisibility,c=t.rootMargin,s=t.root,l=t.triggerOnce,u=t.skip,f=t.initialInView,d=t.fallbackInView,h=t.onChange,v=i.useState(null),g=(0,r.Z)(v,2),m=g[0],y=g[1],b=i.useRef(),w=i.useState({inView:!!f,entry:void 0}),x=(0,r.Z)(w,2),k=x[0],j=x[1];b.current=h,i.useEffect((function(){var e;if(!u&&m)return e=p(m,(function(t,n){j({inView:t,entry:n}),b.current&&b.current(t,n),n.isIntersecting&&l&&e&&(e(),e=void 0)}),{root:s,rootMargin:c,threshold:n,trackVisibility:a,delay:o},d),function(){e&&e()}}),[Array.isArray(n)?n.toString():n,m,s,c,l,u,a,d,o]);var V=null==(e=k.entry)?void 0:e.target,I=i.useRef();m||!V||l||u||I.current===V||(I.current=V,j({inView:!!f,entry:void 0}));var Z=[y,k.inView,k.entry];return Z.ref=Z[0],Z.inView=Z[1],Z.entry=Z[2],Z}var b=n(413),w=n(165),x=n(861),k=n(412),j=n(464),V=n(151),I=n(184),Z=function(){return(0,I.jsxs)("div",{className:"shimmer","aria-label":"Loading content",children:[(0,I.jsx)("div",{className:"image"}),(0,I.jsx)("div",{className:"content",children:(0,I.jsx)("span",{className:"title"})})]})},M=function(e){var t=e.id,n=y({rootMargin:"200px 0px"}),o=(0,r.Z)(n,2),a=o[0],c=o[1],s=(0,j.S)((function(e){return e.setDetailsModalData})),l=(0,i.useState)(null),u=(0,r.Z)(l,2),f=u[0],d=u[1],h=(0,i.useState)(!1),v=(0,r.Z)(h,2),p=v[0],g=v[1],m=function(){g(!0)};(0,i.useEffect)((function(){var e=new AbortController,n=function(){var n=(0,x.Z)((0,w.Z)().mark((function n(){var r;return(0,w.Z)().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return console.info("fetching details for object id:"+t),n.prev=1,n.next=4,(0,V.k)(t,e.signal);case 4:r=n.sent,d(r),n.next=11;break;case 8:n.prev=8,n.t0=n.catch(1),"AbortError"===n.t0.name?(console.log("Fetch details aborted \ud83d\udc40"),console.dir(n.t0)):console.error("Error fetching item id:".concat(t),n.t0);case 11:case"end":return n.stop()}}),n,null,[[1,8]])})));return function(){return n.apply(this,arguments)}}();return c&&n(),function(){e.abort()}}),[t,c]);var M=(0,k.q_)({opacity:1,from:{opacity:0}}),O=(0,k.q_)({opacity:p?1:0}),S=(0,k.q_)((function(){return{transform:"scale(1)",color:"#000",opacity:"0.7",marginTop:0}})),C=(0,r.Z)(S,2),_=C[0],q=_.transform,N=_.color,R=_.opacity,A=C[1];return(0,I.jsx)(k.q.div,{style:(0,b.Z)((0,b.Z)({},M),{},{transform:q}),className:"card",ref:a,onMouseOver:function(){return A({color:"#fff",opacity:"1",transform:"scale(1.06)"})},onMouseLeave:function(){return A({color:"#000",opacity:"0.7",transform:"scale(1)"})},children:c?null==f?(0,I.jsx)(Z,{}):(0,I.jsxs)(k.q.div,{onClick:function(){s(f)},children:[f.primaryImageSmall&&(0,I.jsx)(k.q.img,{style:O,hidden:!0,alt:f.objectName,src:f.primaryImageSmall,onLoad:m}),(0,I.jsx)(k.q.span,{style:{color:N,opacity:R},children:f.title})]},f.objectID):null})},O=i.memo(M),S=function(e){var t=e.data,n=y({rootMargin:"200px 0px"}),i=(0,r.Z)(n,2),o=i[0],a=i[1];return(0,I.jsx)("div",{ref:o,style:{minHeight:a?null:"30000px"},className:"search-result-grid",children:a&&t.map((function(e){return(0,I.jsx)(O,{id:e},e)}))})}}}]);
//# sourceMappingURL=34.c2acfe6a.chunk.js.map