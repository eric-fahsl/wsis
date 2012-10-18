(function(){var a={};
var b=window.location.href;
var c=b.indexOf("#");
if(c>0){b=b.substr(0,c)
}b.replace(/[?&]+([^=&]+)=([^&]*)/gi,function(d,e,f){a[e]=f
});
LOG.updateSetting("wixAppId",42);
LOG.updateSetting("metaSiteId",a.metaSiteId);
LOG.updateSetting("editorSessionId",a.editorSessionId);
client_version="web 1.195.9";
if(client_version=="web ${project.version}"){client_version="DBG"
}if(window.debugMode&&window.debugMode!=="nodebug"){document.title="(;,;) "+client_version
}}());
Constants.TransitionTypes={SWIPE_HORIZONTAL:"swipeHorizontal",SWIPE_HORIZONTAL_FULLSCREEN:"swipeHorizontalFullScreen",SWIPE_VERTICAL:"swipeVertical",SWIPE_VERTICAL_FULLSCREEN:"swipeVerticalFullScreen",CROSS_FADE:"crossfade",SHRINK_FADE:"shrinkfade",OUT_IN:"outIn",NONE:"none"};
W.Classes.newClass({name:"wysiwyg.viewer.utils.TransitionUtils",Class:{Binds:["_swipeHorizontalTransition","_swipeHorizontalTransitionFullScreen","_swipeVerticalTransition","_swipeVerticalTransitionFullScreen","_noTransition","_inOutTransition","_crossFadeTransition","_shrinkFadeTransition","_trackCallback"],_useCSS3:false,initialize:function(){this._Tween=W.Utils.Tween
},getTransition:function(a){switch(a){case Constants.TransitionTypes.SWIPE_HORIZONTAL:return this._swipeHorizontalTransition;
case Constants.TransitionTypes.SWIPE_HORIZONTAL_FULLSCREEN:return this._swipeHorizontalTransitionFullScreen;
case Constants.TransitionTypes.SWIPE_VERTICAL:return this._swipeVerticalTransition;
case Constants.TransitionTypes.SWIPE_VERTICAL_FULLSCREEN:return this._swipeVerticalTransitionFullScreen;
case Constants.TransitionTypes.CROSS_FADE:return this._crossFadeTransition;
case Constants.TransitionTypes.SHRINK_FADE:return this._shrinkFadeTransition;
case Constants.TransitionTypes.OUT_IN:return this._inOutTransition;
case Constants.TransitionTypes.NONE:default:return this._noTransition
}},_noTransition:function(b,a,e,d,c){c()
},_swipeHorizontalTransition:function(b,a,e,d,c){var f=b.getWidth();
this._swipeHorizontalTransitionCommon(b,a,e,d,f,c)
},_swipeHorizontalTransitionFullScreen:function(d,b,g,f,e){var c=d.getContentRect();
var a=Math.max($(document).getSize().x-c.left,c.right);
var h=a-b.getContentRect(b).left;
this._swipeHorizontalTransitionCommon(d,b,g,f,h,e)
},_swipeHorizontalTransitionCommon:function(i,g,h,d,f,c){var b=i.getParent();
var a=this.injects().Utils.getCSSBrowserFeature("animation");
var e=this.injects().Utils.getCSSBrowserFeature("animation-timing-function");
var j={};
i.setStyles({position:"absolute"});
g.setStyles({position:"absolute"});
if(h!==0){f=-f
}g.setStyle("left",f+"px");
if(this._useCSS3&&a){j.left=f+"px";
j["margin-left"]=String(-f)+"px";
j[a]="swipeHoriz "+d+"s";
j[e]="ease-in-out";
b.setStyles(j);
setTimeout(function(){b.setStyle(a,"");
b.setStyles({left:"0px","margin-left":"0px"});
g.setStyles({left:"0px"});
c()
},1000*d)
}else{this._Tween.to(b,d,{left:String(-f),ease:"strong_easeInOut",onComplete:function(){g.setStyles({left:"0px"});
b.setStyles({top:"0px",left:"0px"});
c()
}})
}},_swipeVerticalTransition:function(b,a,e,d,c){var f=b.getHeight();
this._swipeVerticalTransitionCommon(b,a,e,d,f,c)
},_swipeVerticalTransitionFullScreen:function(b,a,e,d,c){var f=b.getCoordinates().top+a.getHeight();
this._swipeVerticalTransitionCommon(b,a,e,d,f,c)
},_swipeVerticalTransitionCommon:function(i,g,h,d,f,c){var b=i.getParent();
var a=this.injects().Utils.getCSSBrowserFeature("animation");
var e=this.injects().Utils.getCSSBrowserFeature("animation-timing-function");
var j={};
i.setStyles({position:"absolute"});
g.setStyles({position:"absolute"});
if(h!==0){f=-f
}g.setStyle("top",f+"px");
if(this._useCSS3&&a){j.top=f+"px";
j["margin-top"]=String(-f)+"px";
j[a]="swipeVert "+d+"s";
j[e]="ease-in-out";
b.setStyles(j);
setTimeout(function(){b.setStyle(a,"");
b.setStyles({top:"0px","margin-top":"0px"});
g.setStyles({top:"0px"});
c()
},1000*d)
}else{this._Tween.to(b,d,{top:String(-f),ease:"strong_easeInOut",onComplete:function(){g.setStyles({top:"0px"});
b.setStyles({top:"0px",left:"0px"});
c()
}})
}},_crossFadeTransition:function(c,a,f,e,d){var b=this.injects().Utils.getCSSBrowserFeature("animation");
c.setStyles({position:"absolute"});
a.setStyles({position:"relative",top:"0px",left:"0px",opacity:"0.0"});
if(this._useCSS3&&b){c.setStyle(b,"fadeOut "+e+"s");
a.setStyle(b,"fadeIn "+e+"s");
setTimeout(function(){a.setStyle(b,"");
c.setStyle(b,"");
a.setStyles({position:"absolute"});
d()
},1000*e)
}else{c.setStyles({opacity:"1.0"});
a.setStyles({opacity:"0.0",visibility:"visible"});
this._Tween.to(c,e,{opacity:0,ease:"swing"});
this._Tween.to(a,e,{opacity:1,ease:"swing",onComplete:function(){d()
}})
}},_shrinkFadeTransition:function(d,b,h,g,f){var c=d.getCoordinates();
var a=d.getParent();
d.setStyles({position:"absolute",top:"0px",left:"0px"});
b.setStyles({position:"absolute",top:"0px",left:"0px"});
var e=new Element("div");
e.setStyles({position:"absolute",width:c.width+"px",height:c.height+"px",overflow:"hidden"});
a.adopt(e);
e.adopt(d);
this._Tween.to(e,g,{top:parseInt(c.height/2)+"px",left:parseInt(c.width/2)+"px",width:"0px",height:"0px",ease:"swing",onComplete:function(){e.getParent().adopt(d);
e.destroy();
f()
}})
},_inOutTransition:function(c,a,f,e,d){var b=this.injects().Utils.getCSSBrowserFeature("animation");
c.setStyles({position:"absolute"});
a.setStyles({position:"relative",top:"0px",left:"0px",opacity:"0.0",visibility:"visible"});
if(this._useCSS3&&b){c.setStyle(b,"fadeOut "+e+"s");
a.setStyle(b,"fadeIn "+e+"s "+e+"s");
setTimeout(function(){c.setStyle(b,"");
c.setStyles({opacity:"0.0"});
setTimeout(function(){a.setStyle(b,"");
a.setStyles({opacity:"1.0"});
a.setStyles({position:"absolute"});
d()
},1000*e)
},1000*e)
}else{c.setStyles({opacity:"1.0"});
a.setStyles({opacity:"0.0",visibility:"visible"});
this._Tween.to(c,e*1.2,{opacity:0,ease:"strong_easeOut"});
this._Tween.to(a,e,{opacity:1,ease:"strong_easeIn",onComplete:function(){d()
}})
}},_frameRateTrackingActive:false,_frameRateCount:0,_trackStartTime:0,_startTracking:function(){this._frameRateTrackingActive=true;
this._frameRateCount=0;
this._trackStartTime=new Date().getTime();
window.requestAnimFrame(this._trackCallback)
},_stopTracking:function(){this._frameRateTrackingActive=false;
var a=(new Date().getTime()-this._trackStartTime)/1000
},_trackCallback:function(){this._frameRateCount++;
if(this._frameRateTrackingActive){window.requestAnimFrame(this._trackCallback)
}}}});
W.Classes.newClass({name:"wysiwyg.viewer.utils.GalleryUtils",Class:{createActionQueue:function(c,b){var a=[];
return function(e){if(e){a.push(e)
}while(a.length>0&&c()===true){if(a.length>b){a.splice(0,a.length-b)
}var d=a.shift();
if(d){d.call()
}}}
},createMinimalGalleryDisplayer:function(c,b){var a=Number.random(0,99999).toString(36);
var d={getViewNode:function(){return c
},getRef:function(){return a
},getDataItem:function(){return b
},setOwner:function(){},invalidateSize:function(){},setSize:function(f,e){var g={width:f,height:e};
c.setStyles(g)
},dispose:function(){c.destroy();
c=null
}};
c.getLogic=function(){return d
}
}}});
W.Classes.newClass({name:"wysiwyg.viewer.utils.MatrixTransitions",imports:["wysiwyg.viewer.utils.TransitionUtils"],Class:{Binds:["_matrixCrossFade","_crossFade","_shrinkFade","_vertSwipe","_horizSwipe","_transitionSequence","_transitionSequenceGenerator","_generalTransition","_destroyHolder","_rotateDiagonalTiming","_noTransition","_timingDiagonalWave"],_transitionUtils:null,_sequenceIndex:0,_positioningFunc:null,_itemsContainer:null,initialize:function(){this._transitionUtils=new this.imports.TransitionUtils()
},setupTransitionMap:function(a,c){this._positioningFunc=a;
this._itemsContainer=c;
var b={crossFadeAllAtOnce:this._generalTransition(this._matrixCrossFadePrepare,this._matrixCrossFade(this._timingAllAtOnce)),crossFadeSequential:this._generalTransition(this._matrixCrossFadePrepare,this._matrixCrossFade(this._timingSequential)),crossFadeHorizWave:this._generalTransition(this._matrixCrossFadePrepare,this._matrixCrossFade(this._timingHorizontalWave)),crossFadeVertWave:this._generalTransition(this._matrixCrossFadePrepare,this._matrixCrossFade(this._timingVerticalWave)),crossFadeDiagonal:this._generalTransition(this._matrixCrossFadePrepare,this._matrixCrossFade(this._timingDiagonalWave)),shrinkFadeAllAtOnce:this._generalTransition(this._matrixCrossFadePrepare,this._shrinkFade(this._timingAllAtOnce)),shrinkFadeSequential:this._generalTransition(this._matrixCrossFadePrepare,this._shrinkFade(this._timingSequential)),shrinkFadeHorizWave:this._generalTransition(this._matrixCrossFadePrepare,this._shrinkFade(this._timingHorizontalWave)),shrinkFadeVertWave:this._generalTransition(this._matrixCrossFadePrepare,this._shrinkFade(this._timingVerticalWave)),shrinkFadeDiagonal:this._generalTransition(this._matrixCrossFadePrepare,this._shrinkFade(this._timingDiagonalWave)),vertSwipeAllAtOnce:this._generalTransition(this._vertSwipePrepare,this._vertSwipe(this._timingSwipeAllAtOnce,this._swipeSingleDirection)),vertSwipeWave:this._generalTransition(this._vertSwipePrepare,this._vertSwipe(this._timingSwipeWave,this._swipeSingleDirection)),vertSwipeAlternate:this._generalTransition(this._vertSwipePrepare,this._vertSwipe(this._timingSwipeAllAtOnce,this._swipeAlternate)),horizSwipeAllAtOnce:this._generalTransition(this._horizSwipePrepare,this._horizSwipe(this._timingSwipeAllAtOnce,this._swipeSingleDirection)),horizSwipeWave:this._generalTransition(this._horizSwipePrepare,this._horizSwipe(this._timingSwipeWave,this._swipeSingleDirection)),horizSwipeAlternate:this._generalTransition(this._horizSwipePrepare,this._horizSwipe(this._timingSwipeAllAtOnce,this._swipeAlternate)),seq_crossFade_All:this._transitionSequence([this._generalTransition(this._matrixCrossFadePrepare,this._matrixCrossFade(this._timingAllAtOnce)),this._generalTransition(this._matrixCrossFadePrepare,this._matrixCrossFade(this._timingSequential)),this._generalTransition(this._matrixCrossFadePrepare,this._matrixCrossFade(this._timingHorizontalWave)),this._generalTransition(this._matrixCrossFadePrepare,this._matrixCrossFade(this._reverseTiming(this._timingHorizontalWave))),this._generalTransition(this._matrixCrossFadePrepare,this._matrixCrossFade(this._timingVerticalWave)),this._generalTransition(this._matrixCrossFadePrepare,this._matrixCrossFade(this._reverseTiming(this._timingVerticalWave))),this._generalTransition(this._matrixCrossFadePrepare,this._matrixCrossFade(this._rotateDiagonalTiming(this._timingDiagonalWave,0))),this._generalTransition(this._matrixCrossFadePrepare,this._matrixCrossFade(this._rotateDiagonalTiming(this._timingDiagonalWave,1))),this._generalTransition(this._matrixCrossFadePrepare,this._matrixCrossFade(this._rotateDiagonalTiming(this._timingDiagonalWave,2))),this._generalTransition(this._matrixCrossFadePrepare,this._matrixCrossFade(this._rotateDiagonalTiming(this._timingDiagonalWave,3)))]),seq_shrink_All:this._transitionSequence([this._generalTransition(this._matrixCrossFadePrepare,this._shrinkFade(this._timingAllAtOnce)),this._generalTransition(this._matrixCrossFadePrepare,this._shrinkFade(this._timingSequential)),this._generalTransition(this._matrixCrossFadePrepare,this._shrinkFade(this._timingHorizontalWave)),this._generalTransition(this._matrixCrossFadePrepare,this._shrinkFade(this._reverseTiming(this._timingHorizontalWave))),this._generalTransition(this._matrixCrossFadePrepare,this._shrinkFade(this._timingVerticalWave)),this._generalTransition(this._matrixCrossFadePrepare,this._shrinkFade(this._reverseTiming(this._timingVerticalWave))),this._generalTransition(this._matrixCrossFadePrepare,this._shrinkFade(this._rotateDiagonalTiming(this._timingDiagonalWave,0))),this._generalTransition(this._matrixCrossFadePrepare,this._shrinkFade(this._rotateDiagonalTiming(this._timingDiagonalWave,1))),this._generalTransition(this._matrixCrossFadePrepare,this._shrinkFade(this._rotateDiagonalTiming(this._timingDiagonalWave,2))),this._generalTransition(this._matrixCrossFadePrepare,this._shrinkFade(this._rotateDiagonalTiming(this._timingDiagonalWave,3)))]),swipe_horiz_All:this._transitionSequence([this._generalTransition(this._horizSwipePrepare,this._horizSwipe(this._timingSwipeAllAtOnce,this._swipeSingleDirection)),this._generalTransition(this._horizSwipePrepare,this._horizSwipe(this._timingSwipeWave,this._swipeSingleDirection)),this._generalTransition(this._horizSwipePrepare,this._horizSwipe(this._reverseTiming(this._timingSwipeWave),this._swipeSingleDirection)),this._generalTransition(this._horizSwipePrepare,this._horizSwipe(this._timingSwipeAllAtOnce,this._swipeAlternate))]),swipe_vert_All:this._transitionSequence([this._generalTransition(this._vertSwipePrepare,this._vertSwipe(this._timingSwipeAllAtOnce,this._swipeSingleDirection)),this._generalTransition(this._vertSwipePrepare,this._vertSwipe(this._timingSwipeWave,this._swipeSingleDirection)),this._generalTransition(this._vertSwipePrepare,this._vertSwipe(this._reverseTiming(this._timingSwipeWave),this._swipeSingleDirection)),this._generalTransition(this._vertSwipePrepare,this._vertSwipe(this._timingSwipeAllAtOnce,this._swipeAlternate))]),seq_crossFade_Horiz:this._transitionSequence([this._generalTransition(this._matrixCrossFadePrepare,this._matrixCrossFade(this._timingHorizontalWave)),this._generalTransition(this._matrixCrossFadePrepare,this._matrixCrossFade(this._reverseTiming(this._timingHorizontalWave)))]),seq_crossFade_Vert:this._transitionSequence([this._generalTransition(this._matrixCrossFadePrepare,this._matrixCrossFade(this._timingVerticalWave)),this._generalTransition(this._matrixCrossFadePrepare,this._matrixCrossFade(this._reverseTiming(this._timingVerticalWave)))]),seq_crossFade_Seq:this._transitionSequence([this._generalTransition(this._matrixCrossFadePrepare,this._matrixCrossFade(this._timingSequential)),this._generalTransition(this._matrixCrossFadePrepare,this._matrixCrossFade(this._reverseTiming(this._timingSequential)))]),seq_crossFade_Diagonal:this._transitionSequence([this._generalTransition(this._matrixCrossFadePrepare,this._matrixCrossFade(this._rotateDiagonalTiming(this._timingDiagonalWave,0))),this._generalTransition(this._matrixCrossFadePrepare,this._matrixCrossFade(this._rotateDiagonalTiming(this._timingDiagonalWave,1))),this._generalTransition(this._matrixCrossFadePrepare,this._matrixCrossFade(this._rotateDiagonalTiming(this._timingDiagonalWave,2))),this._generalTransition(this._matrixCrossFadePrepare,this._matrixCrossFade(this._rotateDiagonalTiming(this._timingDiagonalWave,3)))]),seq_shrink_Horiz:this._transitionSequence([this._generalTransition(this._matrixCrossFadePrepare,this._shrinkFade(this._timingHorizontalWave)),this._generalTransition(this._matrixCrossFadePrepare,this._shrinkFade(this._reverseTiming(this._timingHorizontalWave)))]),seq_shrink_Vert:this._transitionSequence([this._generalTransition(this._matrixCrossFadePrepare,this._shrinkFade(this._timingVerticalWave)),this._generalTransition(this._matrixCrossFadePrepare,this._shrinkFade(this._reverseTiming(this._timingVerticalWave)))]),seq_shrink_Seq:this._transitionSequence([this._generalTransition(this._matrixCrossFadePrepare,this._shrinkFade(this._timingSequential)),this._generalTransition(this._matrixCrossFadePrepare,this._shrinkFade(this._reverseTiming(this._timingSequential)))]),seq_shrink_Diagonal:this._transitionSequence([this._generalTransition(this._matrixCrossFadePrepare,this._shrinkFade(this._rotateDiagonalTiming(this._timingDiagonalWave,0))),this._generalTransition(this._matrixCrossFadePrepare,this._shrinkFade(this._rotateDiagonalTiming(this._timingDiagonalWave,1))),this._generalTransition(this._matrixCrossFadePrepare,this._shrinkFade(this._rotateDiagonalTiming(this._timingDiagonalWave,2))),this._generalTransition(this._matrixCrossFadePrepare,this._shrinkFade(this._rotateDiagonalTiming(this._timingDiagonalWave,3)))]),seq_swipe_alternate:this._transitionSequence([this._generalTransition(this._horizSwipePrepare,this._horizSwipe(this._timingSwipeAllAtOnce,this._swipeAlternate)),this._generalTransition(this._vertSwipePrepare,this._vertSwipe(this._timingSwipeAllAtOnce,this._swipeAlternate))]),seq_swipe_vert_wave:this._transitionSequence([this._generalTransition(this._vertSwipePrepare,this._vertSwipe(this._timingSwipeWave,this._swipeSingleDirection)),this._generalTransition(this._vertSwipePrepare,this._vertSwipe(this._reverseTiming(this._timingSwipeWave),this._swipeSingleDirection))]),seq_swipe_horiz_wave:this._transitionSequence([this._generalTransition(this._horizSwipePrepare,this._horizSwipe(this._timingSwipeWave,this._swipeSingleDirection)),this._generalTransition(this._horizSwipePrepare,this._horizSwipe(this._reverseTiming(this._timingSwipeWave),this._swipeSingleDirection))])};
b.none=this._generalTransition(this._matrixCrossFadePrepare,this._noTransition);
this._transitionMap=b;
b.seq_random=this._transitionSequenceGenerator(this._transitionRandomPicker(this.getTransitionList()))
},getTransition:function(a){return this._transitionMap[a]
},getTransitionList:function(){var a=[];
for(var b in this._transitionMap){a.push(b)
}return a
},_generalTransition:function(a,b){return function(d,c,j,i,h,g,f){var e=a(d,c,j,i,this._itemsContainer,this._positioningFunc);
b(e,j,i,h,g,f)
}.bind(this)
},_transitionSequence:function(a){return function(i,e,c,f,j,d,b){this._sequenceIndex=this._sequenceIndex<a.length?this._sequenceIndex:0;
var g=a[this._sequenceIndex++];
var h=(typeOf(g)==="function")?g:transMap[g];
h(i,e,c,f,j,d,b)
}.bind(this)
},_transitionSequenceGenerator:function(a){return function(d,c,i,h,g,f,e){var b=a(this._sequenceIndex);
b(d,c,i,h,g,f,e)
}.bind(this)
},_transitionRandomPicker:function(a){return function(){var b=(a[parseInt(Math.random()*a.length)]);
return this._transitionMap[b]
}.bind(this)
},_destroyHolder:function(c,b){var a=c.children[0];
if(a){this._itemsContainer.adopt(a);
var d=this._positioningFunc(b);
a.setStyles({position:"absolute",left:d.left+"px",top:d.top+"px"})
}c.destroy()
},_matrixCrossFadePrepare:function(l,g,b,j,f,c){var k=[];
var m;
var n;
var e;
var h;
f.empty();
var a=b*j;
for(var d=0;
d<a;
d++){m=new Element("div");
f.adopt(m);
n=l[d]||new Element("div");
e=g[d]||new Element("div");
m.adopt(e,n);
if(!l[d]){e.setStyles({opacity:"0.0"})
}n.setStyles({left:"0px",top:"0px"});
e.setStyles({left:"0px",top:"0px"});
k.push(m);
h=c(d);
m.setStyles({position:"absolute",left:h.left+"px",top:h.top+"px"})
}return k
},_noTransition:function(a,f,e,d,c,b){a.forEach(this._destroyHolder);
b()
},_crossFade:function(c,a){var b=this;
return function(f,l,k,j,h,g){var e=f.length;
for(var d=0;
d<f.length;
d++){(function(){var i=d;
setTimeout(function(){var n=f[i].children[1];
var m=f[i].children[0];
c(n,m,0,h,function(){b._destroyHolder(f[i],i);
e--;
if(e<=0){g()
}})
},a(i,h*1000,l,k))
})()
}}
},_matrixCrossFade:function(a){return this._crossFade(this._transitionUtils.getTransition(Constants.TransitionTypes.CROSS_FADE),a)
},_shrinkFade:function(a){return this._crossFade(this._transitionUtils.getTransition(Constants.TransitionTypes.SHRINK_FADE),a)
},_vertSwipePrepare:function(h,e,d,c,f,t){var o=[];
var m;
var k;
var g;
var n;
var r;
var a;
var b;
var u;
var l;
f.empty();
l=t(c*d).top;
var s=d*c;
for(var q=0;
q<d;
q++){m=new Element("div");
f.adopt(m);
b=new Element("div");
m.adopt(b);
u=new Element("div");
m.adopt(u);
b.setStyles({position:"absolute",top:"0px",height:l+"px"});
u.setStyles({position:"absolute",top:l+"px",height:l+"px"});
for(var p=0;
p<c;
p++){r=(p*d)+q;
a=t(r);
k=h[r]||new Element("div");
g=e[r]||new Element("div");
u.adopt(g);
b.adopt(k);
k.setStyles({left:"0px",top:a.top+"px"});
g.setStyles({left:"0px",top:a.top+"px"})
}o.push(m);
n=t(q);
m.setStyles({position:"absolute",left:n.left+"px"})
}return o
},_horizSwipePrepare:function(k,f,e,d,g,t){var o=[];
var m;
var l;
var h;
var n;
var r;
var a;
var b;
var u;
var c;
g.empty();
a=t(e-1);
c=a.left+a.width;
var s=e*d;
for(var q=0;
q<d;
q++){m=new Element("div");
g.adopt(m);
b=new Element("div");
m.adopt(b);
u=new Element("div");
m.adopt(u);
b.setStyles({position:"absolute",left:"0px",width:c+"px"});
u.setStyles({position:"absolute",left:c+"px",width:c+"px"});
for(var p=0;
p<e;
p++){r=(q*e)+p;
a=t(r);
l=k[r]||new Element("div");
h=f[r]||new Element("div");
u.adopt(h);
b.adopt(l);
l.setStyles({top:"0px",left:a.left+"px"});
h.setStyles({top:"0px",left:a.left+"px"})
}o.push(m);
n=t(q*e);
m.setStyles({position:"absolute",top:n.top+"px"})
}return o
},_vertSwipe:function(a,b){var d=this._transitionUtils.getTransition(Constants.TransitionTypes.SWIPE_VERTICAL);
var c=this;
return function(g,m,l,k,j,h){var f=g.length;
for(var e=0;
e<g.length;
e++){(function(){var i=e;
setTimeout(function(){b(d,g,i,k,j,function(){var p=g[i].children[1].children;
for(var o=p.length-1;
o>=0;
o--){var n=p[o];
c._itemsContainer.adopt(n);
var q=c._positioningFunc((o*m)+i);
n.setStyles({position:"absolute",left:q.left+"px",top:q.top+"px"})
}g[i].destroy();
f--;
if(f<=0){h()
}})
},a(i,j*1000,g.length))
})()
}}
},_horizSwipe:function(a,b){var d=this._transitionUtils.getTransition(Constants.TransitionTypes.SWIPE_HORIZONTAL);
var c=this;
return function(g,m,l,k,j,h){var f=g.length;
for(var e=0;
e<g.length;
e++){(function(){var i=e;
setTimeout(function(){b(d,g,i,k,j,function(){var p=g[i].children[1].children;
for(var o=p.length-1;
o>=0;
o--){var n=p[o];
c._itemsContainer.adopt(n);
var q=c._positioningFunc((i*m)+o);
n.setStyles({position:"absolute",left:q.left+"px",top:q.top+"px"})
}g[i].destroy();
f--;
if(f<=0){h()
}})
},a(i,j*1000,g.length))
})()
}}
},_swipeSingleDirection:function(f,b,a,e,d,c){f(b[a].children[0],b[a].children[1],e,d,c)
},_swipeAlternate:function(f,b,a,e,d,c){if(a%2===0){f(b[a].children[0],b[a].children[1],e,d,c)
}else{e=e==0?1:0;
f(b[a].children[0],b[a].children[1],e,d,c)
}},_timingAllAtOnce:function(a,c,d,b){return 0
},_timingSequential:function(a,c,d,b){return(a/(d*b))*c
},_timingHorizontalWave:function(b,d,f,c){var a=b%f;
var e=Math.floor((b-a)/f);
return(a/f)*d
},_timingVerticalWave:function(b,d,f,c){var a=b%f;
var e=Math.floor((b-a)/f);
return(e/c)*d
},_reverseTiming:function(a){return function(b,c){return c-a.apply(this,arguments)
}
},_standardDiagonalDistFunc:function(a,b){return Math.sqrt(a*a+b*b)
},_timingDiagonalWave:function(f,c,b,e,h){h=h||this._standardDiagonalDistFunc;
var a=f%b;
var i=Math.floor((f-a)/b);
var g=h(a,i,b,e);
var d=Math.sqrt(b*b+e*e);
return(g/d)*c
},_timingSwipeAllAtOnce:function(b,c,a){return 0
},_timingSwipeWave:function(b,c,a){return(0.6+(b*0.4/a))*c
},_rotateDiagonalTiming:function(c,a){var d;
var b=this;
if(a<=0||a>3){d=this._standardDiagonalDistFunc
}else{if(a==1){d=function(e,h,g,f){return b._standardDiagonalDistFunc(g-e,h)
}
}else{if(a==2){d=function(e,h,g,f){return b._standardDiagonalDistFunc(g-e,f-h)
}
}else{d=function(e,h,g,f){return b._standardDiagonalDistFunc(e,f-h)
}
}}}return function(e,g,h,f){return c(e,g,h,f,d)
}
}}});
W.Classes.newClass({name:"wysiwyg.viewer.managers.classdata.Anchor",Class:{ANCHOR_TOP_TOP:"TOP_TOP",ANCHOR_BOTTOM_TOP:"BOTTOM_TOP",ANCHOR_BOTTOM_BOTTOM:"BOTTOM_BOTTOM",ANCHOR_BOTTOM_PARENT:"BOTTOM_PARENT",ANCHOR_LOCK_BOTTOM:"LOCK_BOTTOM",type:"BOTTOM_TOP",distance:0,topToTop:0,locked:false,fromComp:null,toComp:null,originalValue:NaN}});
(function(){var d=W.BaseComponentClassData.Class.initialize;
var c=W.BaseComponentClassData.Class.dispose;
W.BaseComponent={ResizeSides:{TOP:"RESIZE_TOP",LEFT:"RESIZE_LEFT",BOTTOM:"RESIZE_BOTTOM",RIGHT:"RESIZE_RIGHT"},MoveDirections:{HORIZONTAL:"HORIZONTAL_MOVE",VERTICAL:"VERTICAL_MOVE"},AnchorLock:{NEVER:"never",BY_THRESHOLD:"threshold",ALWAYS:"always"}};
var a={EDITOR_META_DATA:{general:{settings:true,design:true},custom:[]},initialize:function(g,f,e){this._onRender=this._onRender.bind(this);
this.initComponentLayout=this.initComponentLayout.bind(this);
this._anchors=[];
this._$x=this._$y=0;
this._$width=this._$height=100;
this._reverseAnchors=[];
this._actualHeight=-1;
this._autoSizeTimerIntervals=-1;
this.addEvent("render",this._onRender);
this.addEvent("autoSized",this._onAutoSized);
this.addEvent("autoSizedAnimation",this._onAutoSizedAnimation);
d.bind(this)(g,f,e);
this._showOnAllPagesChangeability=true;
this._wysiwygMode=true;
this._resizableSides=[W.BaseComponent.ResizeSides.TOP,W.BaseComponent.ResizeSides.LEFT,W.BaseComponent.ResizeSides.BOTTOM,W.BaseComponent.ResizeSides.RIGHT];
this._moveDirections=[W.BaseComponent.MoveDirections.HORIZONTAL,W.BaseComponent.MoveDirections.VERTICAL];
this._view.setStyle("visibility","hidden");
this.addEvent(Constants.ComponentEvents.READY_FOR_RENDER,this.initComponentLayout)
},initComponentLayout:function(){this._view.setStyle("visibility","visible");
this.removeEvent(Constants.ComponentEvents.READY_FOR_RENDER,this.initComponentLayout);
this._valueFetchingRegex=/[-\d\.]+/;
var l=["x","y","width","height"];
var j=false;
for(var f=0;
f<l.length;
f++){var k=l[f];
var h=this._view.get(k);
if(h!=null&&h!=""){j=true;
var e="set"+k.capitalize();
this[e](h,true)
}}if(j&&(this._view.hasAttribute("pos")===false)){if(this._view.getStyle("position")!="relative"){this._view.setStyle("position","absolute")
}}else{var g=this._view.getAttribute("pos");
if(g){this._view.setStyle("position",g)
}}this.saveCurrentDimensions();
this.saveCurrentCoordinates()
},dispose:function(){this.injects().Layout.deleteSavedAnchorsById(this.getID());
c.apply(this)
},_onRender:function(){if(this._intervalID){clearInterval(this._intervalID)
}this._wCheckForSizeChangeAndFireAutoSized(5);
this.flushMinPhysicalHeightCache()
},_wCheckForSizeChangeAndFireAutoSized:function(f){if(!this._view){return
}this._autoSizeTimerIntervals=Math.max(f,this._autoSizeTimerIntervals);
var e=function(){try{if(this._autoSizeTimerIntervals>1){requestAnimFrame(e)
}if(this._autoSizeTimerIntervals>-1){this._onAutoSized()
}}finally{this._autoSizeTimerIntervals--
}}.bind(this);
window.requestAnimFrame(e)
},_addedToDom:function(){if(this._pendingAutoSize){this._onAutoSized(this._pendingAutoSizeArgs);
delete this._pendingAutoSize;
delete this._pendingAutoSizeArgs
}},_onAutoSized:function(f){if(!this._view||!this._isDisplayed||this.getPhysicalHeight()==0){this._pendingAutoSize=true;
this._pendingAutoSizeArgs=f;
return
}var i=this._actualWidth;
this.flushPhysicalHeightCache();
var g=this.getPhysicalHeight();
var e=this.getWidth();
var h;
if(this._lastHeightOnAutoSize){h=this._lastHeightOnAutoSize
}else{h=0
}if(g!=h||(i!=e&&i)){this._actualWidth=e;
if(!f||!f.ignoreLayout){var j=true;
if(this.getAnchors()==null||!W.Layout._validateAnchorTargetsRendered(this.getAnchors())){j=false
}else{if(this.getHorizontalGroup()!=null&&!W.Layout._validateAnchorTargetsRendered(this.getHorizontalGroup())){j=false
}else{if(!this._areAnchorsAlreadySet){j=false
}}}if(this._anchorTargetsReady||j){this._anchorsInvalidated=false;
this._anchorTargetsReady=true;
this.injects().Layout.enforceAnchors([this])
}else{this._anchorsInvalidated=true
}}}this._lastHeightOnAutoSize=g;
this.fireEvent("autoSizeChange")
},isAnchorsInvalidated:function(){return(this._anchorsInvalidated===true)
},_onAutoSizedAnimation:function(e){this._wCheckForSizeChangeAndFireAutoSized(20)
},_skinParamsChange:function(e){if(this._view){this._view.fireEvent(Constants.DisplayEvents.SKIN_CHANGE,Constants.DisplayEvents.SKIN_CHANGE)
}this._onAutoSized()
},saveCurrentCoordinates:function(){this._lastCoords={x:this.getX(),y:this.getY()}
},getCurrentCoordinates:function(){this._lastCoords={x:this.getX(),y:this.getY()};
return this._lastCoords
},getLastCoordinates:function(){if(!this._lastCoords){this.saveCurrentCoordinates()
}return this._lastCoords
},saveCurrentDimensions:function(){this._lastDimensions={w:this.getWidth(),h:this.getHeight()}
},getCurrentDimensions:function(){this._lastDimensions={w:this.getWidth(),h:this.getHeight()};
return this._lastDimensions
},getLastDimensions:function(){if(!this._lastDimensions){this.saveCurrentDimensions()
}return this._lastDimensions
},getX:function(){return this._$x
},setX:function(e){if(this._$x!=parseInt(e,10)){if(isNaN(parseInt(e,10))){W.Utils.debugTrace("WbaseComp","setX","NaN passed as value");
return
}this._$x=parseInt(e,10);
this._view.setStyle("left",e+"px");
this.onMovement()
}},getY:function(){return this._$y
},setY:function(e){if(this._$y!=parseInt(e,10)){if(isNaN(parseInt(e,10))){W.Utils.debugTrace("WbaseComp","setY","NaN passed as value");
return
}this._$y=parseInt(e,10);
this._view.setStyle("top",e+"px");
this.onMovement()
}},getWidth:function(){return this._$width
},setWidth:function(f,e,g){if(g!=false){g=true
}f=parseInt(f,10);
if(isNaN(f)){W.Utils.debugTrace("WbaseComp","setWidth","NaN passed as value");
return
}f=this._limitWidth(f);
if(this._$width!=f||e){this._$width=f;
this._view.setStyle("width",f+"px");
if(g){this._onResize()
}this.flushMinPhysicalHeightCache();
this.flushPhysicalHeightCache()
}},setHeight:function(f,e,g){if(g!=false){g=true
}f=parseInt(f,10);
if(isNaN(f)){W.Utils.debugTrace("WbaseComp","setHeight","NaN passed as value");
return
}f=this._limitHeight(f);
if(this._$height!=f||e){this._$height=f;
this._view.setStyle("min-height",this._$height+"px");
this.flushPhysicalHeightCache();
if(g){this._onResize()
}}},isInstanceOfClass:function(f){if(this.className==f){return true
}var e=this.$parentPrototype;
while(e){if(e.className==f){return true
}e=e.$parentPrototype
}return false
},getSelectableX:function(){return this.getX()
},getSelectableY:function(){return this.getY()
},getSelectableWidth:function(){return this.getWidth()
},getSelectableHeight:function(){return this.getPhysicalHeight()
},_limitWidth:function(e){return this._limitDimension(e,this.getSizeLimits().minW,this.getSizeLimits().maxW)
},_limitHeight:function(e){return this._limitDimension(e,this.getSizeLimits().minH,this.getSizeLimits().maxH)
},_limitDimension:function(f,e,g){return Math.min(Math.max(f,e),g)
},getHeight:function(){return this._$height
},_onResize:function(){this.fireEvent("resize")
},onMovement:function(){this.fireEvent("componentMoved")
},getPosition:function(){var e=this.getViewNode().getSize();
return{y:this.getY(),x:this.getX(),height:e.y,width:e.x}
},getGlobalPosition:function(){return this._view.getPosition()
},getGlobalPositionRefNode:function(){return this._getEditBoxReferenceNode().getPosition()
},getSizeRefNode:function(){return this._getEditBoxReferenceNode().getSize()
},getID:function(){return this._view.getProperty("id")
},getMinPhysicalHeight:function(){if(!this._minPhysicalHeight){var e=this.getHeight();
this.setHeight(1);
this._minPhysicalHeight=this.getPhysicalHeight();
this.flushPhysicalHeightCache();
this.setHeight(e)
}return this._minPhysicalHeight
},getPhysicalHeight:function(){this._actualHeight=this._actualHeight||this.getViewNode().getSize().y;
this._actualHeight=Math.max(this.getHeight(),this._actualHeight);
return this._actualHeight
},getExtraPixels:function(e){return this.getDivExtraPixels(this._view,e)
},getDivExtraPixels:function(j,f){var i=Number.from(j.getStyle("border-top"))+Number.from(j.getStyle("padding-top"));
var e=Number.from(j.getStyle("border-bottom"))+Number.from(j.getStyle("padding-bottom"));
var h=Number.from(j.getStyle("border-left"))+Number.from(j.getStyle("padding-left"));
var g=Number.from(j.getStyle("border-right"))+Number.from(j.getStyle("padding-right"));
if(f){i+=Number.from(j.getStyle("margin-top"));
e+=Number.from(j.getStyle("margin-bottom"));
h+=Number.from(j.getStyle("margin-left"));
g+=Number.from(j.getStyle("margin-right"))
}return{top:i,bottom:e,left:h,right:g,height:i+e,width:h+g}
},flushPhysicalHeightCache:function(){delete this._actualHeight
},flushMinPhysicalHeightCache:function(){delete this._minPhysicalHeight
},getAnchors:function(){return this._anchors
},setAnchors:function(e){this._areAnchorsAlreadySet=true;
this._anchors=e;
e.forEach(this.addReverseAnchor)
},addAnchor:function(e){this._anchors.push(e);
this.addReverseAnchor(e)
},addReverseAnchor:function(e){if(e.toComp===this){this._reverseAnchors.include(e)
}else{e.toComp.addReverseAnchor(e)
}},getReverseAnchors:function(){return this._reverseAnchors
},getHorizontalGroup:function(){return this._horizontalGroup
},setHorizontalGroup:function(e){this._horizontalGroup=e
},getLayoutMode:function(){return"NORMAL"
},getMinDragY:function(e){return this.injects().Layout.getComponentMinDragY(this,e)
},getParentComponent:function(){var e=this.getViewNode().getParent("[comp]");
if(e&&e.getLogic){return e.getLogic()
}return null
},getResizableSides:function(){return this._resizableSides
},isResizable:function(){return(this._resizableSides.length>0)
},isHorizResizable:function(){return this._resizableSides.contains(W.BaseComponent.ResizeSides.RIGHT)||this._resizableSides.contains(W.BaseComponent.ResizeSides.LEFT)
},isVertResizable:function(){return this._resizableSides.contains(W.BaseComponent.ResizeSides.TOP)||this._resizableSides.contains(W.BaseComponent.ResizeSides.BOTTOM)
},isHorizontallyMovable:function(){return this._moveDirections.contains(W.BaseComponent.MoveDirections.HORIZONTAL)
},isVerticallyMovable:function(){return this._moveDirections.contains(W.BaseComponent.MoveDirections.VERTICAL)
},allowHeightLock:function(){return this.isVertResizable()
},useLayoutOnDrag:function(){return false
},useLayoutOnResize:function(){return false
},isEditableInPlace:function(){return false
},getEditedContent:function(){return null
},isContainable:function(e){return true
},isAnchorable:function(){return{to:{allow:true,lock:W.BaseComponent.AnchorLock.BY_THRESHOLD},from:{allow:true,lock:W.BaseComponent.AnchorLock.BY_THRESHOLD}}
},isSelectable:function(){return true
},isContainer:function(){return false
},isDeleteable:function(){return true
},isDuplicatable:function(){return true
},isDeleteableRecurse:function(){if(!this.isDeleteable()){return false
}var f=this.getViewNode().getElements("[comp]");
for(var e=0;
e<f.length;
e++){if(!f[e].getLogic){continue
}if(!f[e].getLogic().isDeleteable()){return false
}}return true
},isMultiSelectable:function(){return true
},_createClickOverlay:function(){if(this.injects().Viewer.isPublicMode()||this._debugMode){if(this._socialOverlayElement){this._socialOverlayElement.clear()
}return
}if(this._socialOverlayElement){return
}var e={};
this._socialOverlayElement=new Element("A",e);
var f=W.Config.getServiceTopologyProperty("staticThemeUrlWeb")+"/transparent.gif";
this._socialOverlayElement.setStyles({position:"absolute",top:"0",left:"0",height:"100%",width:"100%",background:"transparent url("+f+") repeat top left;"});
this._socialOverlayElement.addEvent("click",function(g){g.stopPropagation();
var h={component:this};
this.injects().Commands.executeCommand("socialWidget.interact",h,this)
}.bind(this));
this.getViewNode().adopt(this._socialOverlayElement)
},_getEditBoxReferenceNode:function(){return this._view
},getShowOnAllPagesChangeability:function(){return this._showOnAllPagesChangeability
},setShowOnAllPagesChangeability:function(e){this._showOnAllPagesChangeability=e
},isSiteSegment:function(){return(this.isInstanceOfClass("wysiwyg.viewer.components.HeaderContainer")||this.isInstanceOfClass("wysiwyg.viewer.components.PagesContainer")||this.isInstanceOfClass("wysiwyg.viewer.components.FooterContainer"))
},_addToolTipToSkinPart:function(f,e){if(f&&f.getViewNode){f=f.getViewNode()
}f.addEvent("mouseenter",function(){W.Commands.executeCommand("Tooltip.ShowTip",{id:e},f)
}.bind(this));
f.addEvent("mouseleave",function(){W.Commands.executeCommand("Tooltip.CloseTip")
}.bind(this))
},canMoveToOtherScope:function(){return true
}};
for(var b in a){W.BaseComponentClassData.Class[b]=a[b]
}})();
W.Classes.newClass({name:"wysiwyg.core.deployment.MobileHtmlScriptsLoader",Class:{Extends:"mobile.core.managers.HtmlScriptsLoader",Static:{MODE_EDITOR:"MODE_EDITOR",MODE_VIEWER:"MODE_VIEWER"},_nonIndexedScriptFiles:["mobile-core-data-types.js","mobile-editor-data-types.js"],_editorScriptFiles:["mobile-core-data-types.js","mobile-editor-data-types.js","mobile-core-components.js","mobile-editor-components.js"],_viewerScriptFiles:["mobile-core-data-types.js","mobile-core-components.js"],initialize:function(a){this._mode=a||this.MODE_EDITOR;
this._scriptFiles=(this._mode==this.MODE_EDITOR)?this._editorScriptFiles:this._viewerScriptFiles;
this.parent()
},_getScriptRoot:function(a){return serviceTopology.scriptsLocationMap["html-client-core"]
}}});
W.Experiments.setDeploymentOrder([{id:"AppsList",description:"",dependencies:[],conflicts:[]},{id:"wixAppsActive",description:"",dependencies:[],conflicts:[]},{id:"Dev",description:"You are looking at it now!",dependencies:[],conflicts:[]},{id:"FBShare",description:"",dependencies:[],conflicts:[]},{id:"ZoomWidth",description:"BugFix: MediaZoomDisplay is now in min-width of 600px",dependencies:[],conflicts:[]},{id:"TPA",description:"Third Party Applications",dependencies:[],conflicts:[]},{id:"TPAButtons",description:'TPA Buttons in the "Add Component" panel',dependencies:[],conflicts:[]},{id:"SM",description:"Site Members (AKA Users of Users)",dependencies:[],conflicts:[]},{id:"Login",description:"",dependencies:["SM"],conflicts:[]},{id:"PageSecurity",description:"",dependencies:["SM"],conflicts:[]},{id:"MasterPage",description:"New Master Page in editor",dependencies:[],conflicts:[]},{id:"MCM",description:"Refactor of ComponentEditBox",dependencies:["MasterPage"],conflicts:[]},{id:"GridLines",description:"Grid lines in editor",dependencies:["MCM","MasterPage"],conflicts:[]},{id:"SocialPanel",description:"MERGED!!",dependencies:[],conflicts:[]},{id:"URM",description:"Undo/Redo Manager",dependencies:[],conflicts:[]},{id:"URMButtons",description:"URM Buttons in the top bar",dependencies:[],conflicts:[]},{id:"FPP",description:"Floating Property Panel",dependencies:[],conflicts:[]},{id:"FPPForcePanel",description:"Floating Property Panel with sticky Component Panel",dependencies:["FPP"],conflicts:[]},{id:"LazyShare",description:"",dependencies:[],conflicts:[]},{id:"Staff",description:"",dependencies:[],conflicts:[]},{id:"PaginatedGrid",description:"MERGED!!",dependencies:[],conflicts:[]},{id:"ToolTip",description:"Tooltip Refactor",dependencies:[],conflicts:[]},{id:"PanelsData",description:"",dependencies:[],conflicts:[]},{id:"StyleNS",description:"",dependencies:[],conflicts:[]},{id:"Fullcolor",description:"MERGED!!",dependencies:[],conflicts:[]},{id:"IframeDialog",description:"",dependencies:[],conflicts:[]},{id:"Zoom",description:"",dependencies:[],conflicts:[]},{id:"WixApps",description:"Wix Apps (AKA Lists)",dependencies:[],conflicts:[]},{id:"NewComps",description:"",dependencies:["PanelsData","ToolTip"],conflicts:[]},{id:"Ecom",description:"eCommerce",dependencies:["StyleNS","IframeDialog","Zoom","NewComps","PanelsData","ToolTip","WixApps"],conflicts:[]},{id:"WalkMe",description:"WalkMe Button in the top bar",dependencies:[],conflicts:[]},{id:"PagesDropDown",description:"MERGED!!",dependencies:[],conflicts:[]},{id:"AudioPlayer",description:"",dependencies:[],conflicts:[]},{id:"SliderAutoPlay",description:"",dependencies:[],conflicts:[]},{id:"BoxShadow",description:"Control Shadows of Components in Advanced Styling",dependencies:["ColorPicker"],conflicts:[]},{id:"ColorPicker",description:"Refactor of the Color Picker",dependencies:[],conflicts:[]},{id:"Fix3713",description:"",dependencies:[],conflicts:[]},{id:"Photo",description:"Photo using the NewImage component",dependencies:[],conflicts:[]},{id:"wixAppsActive",description:"",dependencies:[],conflicts:[]},{id:"Purple",description:'Purple "Upgrade" buttons',dependencies:[],conflicts:[]},{id:"FirstSave",description:"Wait 20 minutes before popping the Save Dialog ",dependencies:[],conflicts:[]},{id:"HourGlass",description:"Show an Hourglass on page transitions",dependencies:[],conflicts:[]},{id:"DoubleClick",description:"Add DoubleClick functionality to components",dependencies:["FPP"],conflicts:[]},{id:"PremiumWixAds",description:"Monetize WixAds in Preview Mode",dependencies:[],conflicts:[]},{id:"PartialSave",description:"Enable saving of partial data (separated pages, master page, and deleted pages)",dependencies:[],conflicts:[]},{id:"TraverseComps",description:"the component edit box traverses between components with ctrl+m, ctrl+shift+m",dependencies:["FPP"],conflicts:[]},{id:"GEM",description:"Gallery Expand Mode - adding an option that upon click on an image, it goes to the specified link",dependencies:[],conflicts:[]},{id:"StyleRefactor",description:"New Style Objects",dependencies:[],conflicts:[]},{id:"Bug4356",description:"A temporary fix for bug 4356: Affects only Chrome and Safari. for more info: http://code.google.com/p/chromium/issues/detail?id=139613",dependencies:[],conflicts:[]},{id:"bug3313",description:"When a text box containing a link is duplicated and the link is changed in either text box, both links change",dependencies:[],conflicts:[]},{id:"AppMarket",description:"TPA App Market UI",dependencies:[],conflicts:[]}]);
W.Classes.newClass({name:"wysiwyg.viewer.managers.tpa.TPAComponentRegistrar",Class:{Static:{SECTION:"section",WIDGETS:"widgets",SECTION_PAGE_ID:"pageId",APPLICATION_ID_KEY:"tpaApplicationId"},initialize:function(){this._components={}
},register:function(a,d){d=a.getApplicationId()||d;
var c=this._getDataObjectByApplicationId(d);
if(a&&a.getOriginalClassName()=="wysiwyg.viewer.components.tpapps.TPASection"){c[this.SECTION]=a
}else{var b=this._getWidgets(d);
b.push(a)
}},unregister:function(b,e){e=b.getApplicationId()||e;
var d=this._getDataObjectByApplicationId(e);
if(b&&b.getOriginalClassName()=="wysiwyg.viewer.components.tpapps.TPASection"){delete d[this.SECTION]
}else{var c=this._getWidgets(e);
var a=c.indexOfByPredicate(function(f){return(f===b)
}.bind(this));
c.splice(a,1)
}},getPageId:function(d){var b=W.Data.getDataMap();
var c=Object.filter(b,function(e){return e.get("type")=="Page"&&e.get(this.APPLICATION_ID_KEY)==d
}.bind(this));
var a=Object.values(c);
if(a.length>0){return a[0].get("id")||null
}else{return null
}},_getDataObjectByApplicationId:function(a){if(!this._components[a]){this._components[a]={}
}return this._components[a]
},_getByApplicationId:function(c){var a=[].concat(this._getWidgets(c));
var b=this.getSection(c);
if(b){a.push(b)
}return a
},each:function(c,b){var a=this._getByApplicationId(c);
Array.each(a,function(d){b(d)
})
},_getWidgets:function(b){var a=this._getDataObjectByApplicationId(b);
if(!a[this.WIDGETS]){a[this.WIDGETS]=[]
}return a[this.WIDGETS]
},getSection:function(b){var a=this._getDataObjectByApplicationId(b);
return a[this.SECTION]
}}});
W.Classes.newClass({name:"wysiwyg.viewer.managers.tpa.URLBuilder",Class:{buildStateLessUrl:function(c,d,a,b){return this._buildUrlInternal(c,false,d,a,b)
},buildUrl:function(c,d,a,b){return this._buildUrlInternal(c,true,d,a,b)
},_buildUrlInternal:function(e,f,h,b,c){if(!e){return null
}var a=function(i){switch(i){case"app-state":return this._getCurrentState();
break;
case"instance":return c.instance;
break;
case"section-url":if(W.Viewer.isPublicMode()){return b.getSectionURL()||null
}else{return g
}break;
case"target":if(W.Viewer.isPublicMode()){return"_top"
}else{return"_self"
}break;
case"width":return b.getViewNode().getWidth();
break;
case"compId":return b.getComponentId();
break
}}.bind(this);
var g="";
var d=[];
g=e;
if(f){g+=this._getCurrentState()
}if(!String.contains(g,"?")){g+="?"
}else{g+="&"
}h.push("compId");
Array.each(h,function(i){d.push(i+"="+encodeURIComponent(a(i)))
});
return g+d.join("&")
},_getCacheKiller:function(){return new Date().getTime().toString()
},_getCurrentState:function(){var a=W.Utils.hash.getHashParts(location.hash);
return"/"+(a.extData||"")
}}});
W.Classes.newClass({name:"wysiwyg.viewer.managers.appdata.AppDataHandler",Class:{getAppsData:function(){if(!window.rendererModel){window.rendererModel={}
}if(!window.rendererModel.clientSpecMap){window.rendererModel.clientSpecMap={}
}return window.rendererModel.clientSpecMap
},registerAppData:function(a){this.getAppsData()[a.applicationId]=a
},getAppData:function(a){return this.getAppsData()[a]||{}
},getWidgetData:function(c,b){var a=this.getAppData(c).widgets||{};
return a[b]||{}
},getSiteMembersData:function(){var b=Object.filter(this.getAppsData(),function(c){return c&&c.type&&c.type.toLowerCase()=="sitemembers"
});
var a=Object.values(b);
if(a&&a.length>0){return a[0]
}else{return null
}},getWidgetProperty:function(c,a,b){return this.getWidgetData(c,a)[b]
},getLargestApplicationId:function(){var b=this.getAppsData();
var a=0;
for(var c in b){if(b.hasOwnProperty(c)){c=parseInt(c);
if(a<c){a=c
}}}return a
}}});
W.Classes.newClass({name:"wysiwyg.viewer.managers.LayoutManager",Class:{Extends:Events,Binds:["_getAnchoredY","_getAnchoredH"],LOCK_THRESHOLD:70,DEFAULT_MARGIN:10,SUGGEST_ANCHOR_MARGIN:20,FLAG_DIRTY_TOP:1,FLAG_DIRTY_BOTTOM:2,initialize:function(){var a=this;
W.Classes.get("wysiwyg.viewer.managers.classdata.Anchor",function(b){a._AnchorClass=b;
a._isReady=true
});
this._changedByHGroup=[];
this._emptyArr=[]
},setSavedAnchor:function(a){this._savedAnchors=a
},attachSavedAnchors:function(a){for(var b in this._savedAnchors){if(this._savedAnchors[b]){var c=$(b);
if(a&&!a.contains(c)){continue
}if(c&&c.getLogic&&c.getLogic().getAnchors().length===0){if(this.attachSavedAnchorsToComponent(c.getLogic(),this._savedAnchors[b])){delete this._savedAnchors[b]
}}}}},attachSavedAnchorsToComponent:function(d,g){var b=[];
var a=[];
var c;
for(var f=0;
f<g.length;
f++){c=this.desrializeAnchor(g[f],d);
if(c.type==c.ANCHOR_LOCK_BOTTOM){a.push(c)
}else{b.push(c)
}}this._setComponentAnchors(d,b);
if(a.length>0){var e=new this._AnchorClass();
e.distance=0;
e.originalValue=0;
e.topToTop=0;
e.type=e.ANCHOR_LOCK_BOTTOM;
e.fromComp=d;
e.toComp=d;
a.unshift(e);
for(f=0;
f<a.length;
f++){a[f].toComp.setHorizontalGroup(a)
}}},_setComponentAnchors:function(b,a){var c=b.getAnchors();
b.setAnchors(a);
this.fireEvent("updateAnchors",{data:{compId:b.getComponentId(),oldAnchors:c,newAnchors:a,sender:"layoutmanager"}})
},desrializeAnchor:function(c,b){var a=new this._AnchorClass();
a.distance=c.distance||0;
a.topToTop=c.topToTop||0;
a.originalValue=c.originalValue||0;
a.type=c.type;
a.toComp=$(c.targetComponent).getLogic();
a.fromComp=b;
a.locked=c.locked||false;
return a
},reportResize:function(d){var b;
if(!d||d.length===0){throw new Error("Invalid changed elements")
}this._updateAnchors(d[0],d,false);
for(b=0;
b<d.length;
b++){this._updateChildAnchors(d[b])
}var a=this._getAndClearChangedByHGroup();
for(b=0;
b<a.length;
b++){this._updateChildAnchors(a[b]);
this._updateAnchors(a[0],[a[0]],false)
}var c={type:"componentResize",data:{changedElements:d}};
this._reportElementsSize(c.data.changedElements);
this.fireEvent(c.type,c)
},_reportElementsSize:function(d){var c=null;
for(var b=0;
b<d.length;
b++){c=d[b];
var a={data:{type:"wysiwyg.editor.managers.undoredomanager.PositionChange",compId:c.getComponentId(),oldDimensions:c.getLastDimensions(),newDimensions:c.getCurrentDimensions(),oldCoordinates:c.getLastCoordinates(),newCoordinates:c.getCurrentCoordinates()}};
this.fireEvent("updateSize",a)
}},reportMove:function(e){if(!e||e.length===0){throw new Error("Invalid changed elements")
}for(var b=0;
b<e.length;
b++){var d={data:{type:"wysiwyg.editor.managers.undoredomanager.PositionChange",compId:e[b].getComponentId(),oldCoordinates:e[b].getLastCoordinates(),newCoordinates:e[b].getCurrentCoordinates(),oldDimensions:e[b].getLastDimensions(),newDimensions:e[b].getCurrentDimensions()}};
this.fireEvent("updatePosition",d)
}this._updateAnchors(e[0],e,false);
var a=this._getAndClearChangedByHGroup();
for(b=0;
b<a.length;
b++){this._updateAnchors(a[0],[a[0]],false)
}var c={type:"componentMove",data:{changedElements:e}};
this.fireEvent(c.type,c)
},reportReparent:function(c,a){if(!c||c.length===0){throw new Error("Invalid changed elements")
}this._updateChildAnchors(a);
this._updateAnchors(c[0],c,false);
var b={type:"addComponent",data:{changedElements:c,oldParent:a}};
this.fireEvent("resetHistoryStack");
this.fireEvent(b.type,b)
},reportAddComponent:function(a){this._updateAnchors(a[0],a,false);
var b={type:"onAddComponent",data:a};
this.fireEvent(b.type,b);
this.fireEvent("resetHistoryStack")
},reportDeleteComponent:function(a){this._updateChildAnchors(a);
var b={type:"onComponentDelete",data:a};
this.fireEvent(b.type,b);
this.fireEvent("resetHistoryStack")
},reportResizeStart:function(b){this._getAndClearChangedByHGroup();
var a={type:"componentResizeStart",data:b};
this.fireEvent(a.type,a)
},deleteSavedAnchorsById:function(a){if(this._savedAnchors&&this._savedAnchors[a]){delete this._savedAnchors[a]
}},getOptionalBottomLocks:function(f){var l=[];
var a=[];
var m;
var h=f.getViewNode().getParent().getChildren("[comp]");
var k=f.getHorizontalGroup();
var d,e;
if(k){for(d=0,e=k.length;
d<e;
++d){var j=k[d];
if(j.toComp!=f){l.push({locked:true,target:j.toComp});
a.push(j.toComp)
}}m=k.slice(0)
}for(d=0,e=h.length;
d<e;
++d){var g=h[d],b=g.getLogic&&g.getLogic();
if(!b){continue
}if(b!=f&&a.indexOf(b)===-1&&!this._isHorizontalOverlap(f,b)&&this._isVerticalOverlap(f,b)&&b.allowHeightLock()){if(m){var c=new this._AnchorClass();
c.fromComp=m[0].fromComp;
c.toComp=b;
m.push(c);
if(this._isValidHGroup(m)){l.push({locked:false,target:b})
}m.pop(c)
}else{l.push({locked:false,target:b})
}}}return l
},toggleHGroup:function(c,a,b){var h=c.getHorizontalGroup();
var g=a.getHorizontalGroup();
var e;
var f;
if(b){for(var d=0;
d<h.length;
d++){if(h[d].toComp===a){a.setHorizontalGroup(null);
h.splice(d,1)
}}if(h.length===1){c.setHorizontalGroup(null);
return
}e=h
}else{if(h&&g){h.combine(g);
e=h
}else{if(g){f=new this._AnchorClass();
f.type=f.ANCHOR_LOCK_BOTTOM;
f.fromComp=g[0].fromComp;
f.toComp=c;
g.push(f);
e=g
}else{if(h){f=new this._AnchorClass();
f.type=f.ANCHOR_LOCK_BOTTOM;
f.fromComp=h[0].fromComp;
f.toComp=a;
h.push(f);
e=h
}else{e=[];
f=new this._AnchorClass();
f.type=f.ANCHOR_LOCK_BOTTOM;
f.fromComp=c;
f.toComp=c;
e.push(f);
f=new this._AnchorClass();
f.type=f.ANCHOR_LOCK_BOTTOM;
f.fromComp=c;
f.toComp=a;
e.push(f)
}}}}this._updateHGroup(e)
},_updateHGroup:function(c){for(var a=0;
a<c.length;
a++){var b=c[a];
b.toComp.setHorizontalGroup(c);
b.fromComp=c[0].fromComp;
b.distance=this._getBottomDiff(b.fromComp,b.toComp);
b.topToTop=b.toComp.getY()-b.fromComp.getY()
}},_clearHGroup:function(b){for(var a=0;
a<b.length;
a++){b[a].toComp.setHorizontalGroup(null)
}},_isValidHGroup:function(g){var a;
for(a=0;
a<g.length;
a++){if(g[a].toComp.getIsDisposed()||!g[a].toComp.allowHeightLock()){return false
}}var h=g.slice();
h.sort(function(j,i){var l=j.toComp.getX();
var k=i.toComp.getX();
if(l===k){return 0
}else{return l>k?1:-1
}});
for(a=0;
a<h.length-1;
a++){if(h[a].toComp.getX()+h[a].toComp.getWidth()>=h[a+1].toComp.getX()){return false
}}var d=g[0].toComp.getViewNode().getParent();
var c=Number.MAX_VALUE;
var f=-Number.MAX_VALUE;
for(a=0;
a<g.length;
a++){if(g[a].toComp.getIsDisposed()){return false
}if(g[a].toComp.getViewNode().getParent()!=d){return false
}var b=g[a].toComp.getY();
var e=g[a].toComp.getPhysicalHeight()+b;
c=Math.min(e,c);
f=Math.max(b,f)
}return(f<c)
},_getBottomDiff:function(b,a){return a.getY()+a.getPhysicalHeight()-b.getY()-b.getPhysicalHeight()
},_validateCommonParent:function(d,a){if(d.length===0){return
}var c;
if(a){c=a.getViewNode().getParent()
}else{c=d[0].getViewNode().getParent()
}var b=function(e){return c!==e.getViewNode().getParent()
};
if(d.some(b)){throw new Error("Invalid elements scope")
}},_getSiblingsYSortedArray:function(a){var b=a.getViewNode().getParent().getChildren("[comp]");
if(b.some(function(c){return !(c.getLogic)
})){return[]
}return b.sort(function(d,c){var f=d.getLogic().getY();
var e=c.getLogic().getY();
if(f===e){return 0
}else{return f>e?1:-1
}}).map(function(c){return c.getLogic()
})
},_isHorizontalOverlap:function(b,a){var e=b.getX();
var f=e+b.getWidth();
var c=a.getX();
var d=c+a.getWidth();
return !(e>d||c>f)
},_isVerticalOverlap:function(b,a){var e=b.getY();
var f=e+b.getPhysicalHeight();
var c=a.getY();
var d=c+a.getPhysicalHeight();
return !(e>d||c>f)
},_clearReverseAnchorsByScope:function(d,b){for(var c=d.length-1;
c>-1;
c--){var a=d[c];
if(b){if(a.type==a.ANCHOR_BOTTOM_PARENT){d.splice(c,1)
}}else{if(a.type!=a.ANCHOR_BOTTOM_PARENT){d.splice(c,1)
}}}},_updateAnchors:function(q,d,p){this._validateCommonParent(d,q);
var f=this._getSiblingsYSortedArray(q);
var n=[];
var b=[];
var o,j,h,l=f.length,g=null;
for(h=0;
h<f.length;
h++){n[h]={};
this._clearReverseAnchorsByScope(f[h].getReverseAnchors(),false);
if(f[h].getHorizontalGroup()){f[h].getHorizontalGroup().$hGroupDirty=true
}}var m=q.getParentComponent();
if(m){this._clearReverseAnchorsByScope(m.getReverseAnchors(),true)
}for(o=l-1;
o>=0;
o--){var k=f[o];
this._updateOrClearHGroup(k.getHorizontalGroup());
b[o]=k.getAnchors();
var c=[];
var e=false;
if(k.isAnchorable().from.allow){for(j=o+1;
j<l;
j++){var a=f[j];
if(!a.isAnchorable()||!a.isAnchorable().to.allow){continue
}g=null;
if(!n[o][j]&&this._isHorizontalOverlap(k,a)){if(d.indexOf(k)===-1&&d.indexOf(a)===-1){g=this._findAnchorToComp(b[o],a)
}g=g||this._createToTopAnchor(k,a);
n[o][j]=true;
if(g.type==g.ANCHOR_BOTTOM_TOP){e=true;
this._mergeSets(n[o],n[j])
}if(g.type==g.ANCHOR_TOP_TOP&&k.isAnchorable().to.allow&&k.isAnchorable().to.allowBottomBottom!==false){this._checkAndAddBottomAnchor(a,k)
}c.push(g)
}}if(!e){if(m&&m.isAnchorable().to.allow){g=null;
if(d.indexOf(k)===-1&&!p){g=this._findAnchorToComp(b[o],m)
}if(!g){g=this._createToParentAnchor(k,m)
}c.push(g)
}}}k.setAnchors(c);
this._setComponentAnchors(k,c)
}},_updateOrClearHGroup:function(a){if(a&&a.$hGroupDirty){delete a.$hGroupDirty;
if(this._isValidHGroup(a)){this._updateHGroup(a)
}else{this._clearHGroup(a)
}}},_setAnchorableIsLocked:function(a){var c=a.fromComp;
var b=a.toComp;
if(c.isAnchorable().from.lock==W.BaseComponent.AnchorLock.NEVER||b.isAnchorable().to.lock==W.BaseComponent.AnchorLock.NEVER){a.locked=false
}else{if(c.isAnchorable().from.lock==W.BaseComponent.AnchorLock.ALWAYS||b.isAnchorable().to.lock==W.BaseComponent.AnchorLock.ALWAYS){a.locked=true
}else{a.locked=a.distance<=this.LOCK_THRESHOLD
}}},_setAnchorableDistance:function(a,b){var d=a.fromComp;
var c=a.toComp;
if(d.isAnchorable().from.distance!=undefined){b=d.isAnchorable().from.distance
}else{if(c.isAnchorable().to.distance!=undefined){b=c.isAnchorable().to.distance
}}a.distance=b
},_createToParentAnchor:function(d,a){var b=d.getY();
var f=d.getPhysicalHeight();
var e=a.getInlineContentContainer().getSize().y;
var c=new this._AnchorClass();
c.type=c.ANCHOR_BOTTOM_PARENT;
c.fromComp=d;
c.toComp=a;
this._setAnchorableDistance(c,e-b-f);
this._setAnchorableIsLocked(c);
c.topToTop=b;
c.originalValue=e;
return c
},_createToTopAnchor:function(b,c){var a=b.getY();
var g=c.getY();
var f=b.getPhysicalHeight();
var e=c.getPhysicalHeight();
var d=new this._AnchorClass();
d.fromComp=b;
d.toComp=c;
if(g+e>a+f&&g>a+f/2){d.type=d.ANCHOR_BOTTOM_TOP;
this._setAnchorableDistance(d,g-a-f)
}else{d.type=d.ANCHOR_TOP_TOP;
this._setAnchorableDistance(d,g-a)
}this._setAnchorableIsLocked(d);
d.topToTop=g-a;
d.originalValue=g;
return d
},_checkAndAddBottomAnchor:function(c,a){var g=a.getY();
var b=c.getY();
var d=a.getPhysicalHeight();
var f=c.getPhysicalHeight();
if(b+f<g+d){var e=new this._AnchorClass();
e.type=e.ANCHOR_BOTTOM_BOTTOM;
e.fromComp=c;
e.toComp=a;
this._setAnchorableDistance(e,g+d-b-f);
e.locked=e.distance<=this.LOCK_THRESHOLD;
e.topToTop=b-g;
e.originalValue=d;
c.addAnchor(e)
}},_getAnchoredY:function(b){switch(b.type){case b.ANCHOR_BOTTOM_TOP:var c=b.fromComp.getPhysicalHeight();
var a=b.fromComp.getY()+c;
if(b.locked){a+=b.distance
}else{a+=this.DEFAULT_MARGIN
}return Math.max(a,b.fromComp.getY()+c/2);
case b.ANCHOR_TOP_TOP:return b.fromComp.getY()+b.distance
}},_getAnchoredH:function(b){var a=b.fromComp.getPhysicalHeight();
var c=b.fromComp.getY()+a;
if(b.locked){c+=b.distance
}else{if(b.toComp.getOriginalClassName()!="mobile.core.components.Page"){c+=this.DEFAULT_MARGIN
}}if(b.type==b.ANCHOR_BOTTOM_BOTTOM){c-=b.toComp.getY()
}else{if(b.type==b.ANCHOR_BOTTOM_PARENT&&b.toComp.getInlineContentContainer){c=c-b.toComp.getInlineContentContainer().getSize().y+b.toComp.getPhysicalHeight()
}}return c
},enforceAnchors:function(b,f,k){if(b.length===0||b[0].getViewNode().getParent()===null){return
}this._validateCommonParent(b);
var h=b[0].getParentComponent();
var d=this._getSiblingsYSortedArray(b[0]);
if(d.length==0||!this._validateComponentsRendered(d)){for(e=0;
e<b.length;
e++){delete b[e].$layoutDirtyFlag
}return
}for(var e=0;
e<b.length;
e++){if(!f){b[e].$layoutDirtyFlag=this.FLAG_DIRTY_BOTTOM
}else{b[e].$layoutDirtyFlag=this.FLAG_DIRTY_TOP
}}var l=[];
for(e=0;
e<d.length;
e++){if(!l[e]){l[e]=0
}l[e]++;
if(l[e]>20){W.Utils.debugTrace("Layout Manager","enforceAnchors","infinite loop");
this._enforceParentIfNeeded(h);
return
}d[e].$tempIndex=e;
if(d[e].$layoutDirtyFlag){var a=Number.MAX_VALUE;
var g=d[e];
for(var c=0;
c<g.getAnchors().length;
c++){a=Math.min(this._enforceSingleAnchor(g.getAnchors()[c],k),a)
}if(g.getHorizontalGroup()){a=Math.min(this._enforceHGroup(g),a)
}delete g.$layoutDirtyFlag;
if(a<e){e=a-1
}}}for(e=0;
e<d.length;
e++){delete d[e].$tempIndex;
delete d[e].$layoutDirtyFlag
}this._enforceParentIfNeeded(h)
},_enforceParentIfNeeded:function(a){if(a&&a.$layoutDirtyFlag==this.FLAG_DIRTY_BOTTOM){this.enforceAnchors([a])
}},_validateComponentsRendered:function(a){for(var b=0;
b<a.length;
b++){if(a[b].getPhysicalHeight()==0){return false
}}return true
},_validateNodesRendered:function(c){var b=[];
for(var a=0;
a<c.length;
a++){if(!c[a].getLogic){return false
}b.push(c[a].getLogic())
}return this._validateComponentsRendered(b)
},_validateAnchorTargetsRendered:function(b){for(var a=0;
a<b.length;
a++){if(!b[a].toComp.isRendered()){return false
}}return true
},_getContainerContentHeight:function(a){var d=0;
var c=a.getChildComponents();
for(var b=0;
b<c.length;
b++){d=Math.max(this._getCompBottom(c[b].getLogic()),d)
}return d
},_getCompBottom:function(b){var c=b.getY();
var a=b.getPhysicalHeight();
return Math.max(c+a,0)
},_getComponentContentHeight:function(a){var b=0;
if(a.getChildComponents&&this._validateNodesRendered(a.getChildComponents())){b=this._getContainerContentHeight(a)
}else{b=a.getMinPhysicalHeight()
}return b
},getComponentMinResizeHeight:function(a){if(a.getHorizontalGroup()){var c=this._findAnchorToComp(a.getHorizontalGroup(),a);
return this.getHGroupMinBottom(a.getHorizontalGroup())-a.getY()+c.distance
}else{if(a.getChildComponents){var b=this._getContainerContentHeight(a);
if(a.getInlineContentContainer){b=b+a.getPhysicalHeight()-a.getInlineContentContainer().getSize().y
}return b
}}return 0
},getComponentMinDragY:function(b,e){if(!e){e=this._emptyArr
}var f=0;
for(var c=0;
c<b.getReverseAnchors().length;
c++){var a=b.getReverseAnchors()[c];
if(e.contains(a.fromComp)){continue
}if(a.type==a.ANCHOR_BOTTOM_TOP){var d=this._getCompBottom(a.fromComp);
f=Math.max(d,f)
}else{if(a.type==a.ANCHOR_TOP_TOP){f=Math.max(a.fromComp.getY(),f)
}}}return f
},getHGroupMinBottom:function(d){if(d.length<2){return 0
}var b=-Number.MAX_VALUE;
for(var a=0;
a<d.length;
a++){var c=d[a];
b=Math.max(this._getComponentContentHeight(c.toComp)-c.distance+c.toComp.getY(),b)
}return b
},getHGroupMinY:function(d){if(d.length<2){return 0
}var b=-Number.MAX_VALUE;
for(var a=0;
a<d.length;
a++){var c=d[a];
b=Math.max(this.getComponentMinDragY(c.toComp)-c.topToTop,b)
}return b
},_enforceHGroup:function(k){var m=Number.MAX_VALUE;
var h=k.getHorizontalGroup();
var c=this._findAnchorToComp(h,k);
var b,d;
if(!c){return Number.MAX_VALUE
}if(k.$layoutDirtyFlag==this.FLAG_DIRTY_TOP){var a=this.getHGroupMinY(k.getHorizontalGroup());
var f=Math.max(a,c.toComp.getY()-c.topToTop);
m=Math.min(this._setHGroupPartY(c.fromComp,f),m);
for(d=0;
d<k.getHorizontalGroup().length;
d++){b=k.getHorizontalGroup()[d];
var l=b.fromComp.getY()+b.topToTop;
m=Math.min(this._setHGroupPartY(b.toComp,l),m)
}}var j=this.getHGroupMinBottom(k.getHorizontalGroup());
var e=Math.max(j-c.fromComp.getY(),c.toComp.getY()+c.toComp.getPhysicalHeight()-c.distance-c.fromComp.getY());
m=Math.min(this._setHGroupPartHeight(c.fromComp,e),m);
for(d=0;
d<k.getHorizontalGroup().length;
d++){b=k.getHorizontalGroup()[d];
var g=b.fromComp.getY()+b.fromComp.getPhysicalHeight()+b.distance-b.toComp.getY();
m=Math.min(this._setHGroupPartHeight(b.toComp,g),m)
}return m
},_setHGroupPartHeight:function(a,b){var c=a.getPhysicalHeight();
if(c!=b){b=b-a.getExtraPixels().bottom-a.getExtraPixels().top;
a.setHeight(b);
a.$layoutDirtyFlag=this.FLAG_DIRTY_BOTTOM;
this._changedByHGroup.include(a);
if(a.$tempIndex!=undefined){return a.$tempIndex
}}return Number.MAX_VALUE
},_setHGroupPartY:function(a,c){var b=a.getY();
if(b!=c){a.setY(c);
a.$layoutDirtyFlag=this.FLAG_DIRTY_TOP;
this._changedByHGroup.include(a);
if(a.$tempIndex!=undefined){return a.$tempIndex
}}return Number.MAX_VALUE
},_updateChildAnchors:function(a){if(a&&a.getChildComponents){var b=a.getChildComponents();
if(!this._validateNodesRendered(b)){return
}if(b.length>0){this._updateAnchors(b[0].getLogic(),[],true)
}else{this._clearReverseAnchorsByScope(a.getReverseAnchors(),true)
}}},_getAndClearChangedByHGroup:function(){var a=this._changedByHGroup;
this._changedByHGroup=[];
return a
},_enforceSingleAnchor:function(b,a){if(b.type==b.ANCHOR_TOP_TOP&&b.fromComp.$layoutDirtyFlag===this.FLAG_DIRTY_BOTTOM){return Number.MAX_VALUE
}if(b.type==b.ANCHOR_BOTTOM_PARENT||b.type==b.ANCHOR_BOTTOM_BOTTOM){return this._enforceFromBottomTypeAnchor(b)
}return this._enforceToTopTypeAnchor(b,a)
},_enforceToTopTypeAnchor:function(c,b){var e=c.toComp;
var a=this._getAnchoredY(c);
var d=e.getY();
var f=-Number.MAX_VALUE;
if(c.type==c.ANCHOR_BOTTOM_TOP&&!c.locked){f=c.originalValue
}if(!b){e.setY(e.getY()<a?a:this._getMaxAnchoredY(e,f))
}if(d!==e.getY()){e.$layoutDirtyFlag=this.FLAG_DIRTY_TOP
}return Number.MAX_VALUE
},_enforceFromBottomTypeAnchor:function(b){var e=b.toComp;
var a=e.getPhysicalHeight();
var d=this._getAnchoredH(b);
var c=d;
if(b.toComp.layoutMinHeight){c=b.toComp.layoutMinHeight()
}else{if(!b.locked&&e.getOriginalClassName()!="mobile.core.components.Page"){c=b.originalValue
}}e.setHeight(a<d?d:this._getMaxAnchoredH(e,c));
if(a!==e.getHeight()){e.$layoutDirtyFlag=this.FLAG_DIRTY_BOTTOM;
if(b.type==b.ANCHOR_BOTTOM_BOTTOM){return e.$tempIndex
}}return Number.MAX_VALUE
},_getMaxAnchoredH:function(a,d){if(!d){d=-Number.MAX_VALUE
}var b=this._getAnchoredH;
var c=d;
a.getReverseAnchors().forEach(function(e){if(e.type!=e.ANCHOR_BOTTOM_PARENT&&e.type!=e.ANCHOR_BOTTOM_BOTTOM){return
}var f=b(e);
if(!e.locked&&a.getOriginalClassName()!="mobile.core.components.Page"){f=Math.max(f,e.originalValue)
}c=Math.max(f,c)
});
return c
},_getMaxAnchoredY:function(b,c){var d=this._getAnchoredY;
var a=c;
b.getReverseAnchors().forEach(function(f){if(f.type!=f.ANCHOR_BOTTOM_TOP&&f.type!=f.ANCHOR_TOP_TOP){return
}var e=d(f);
a=Math.max(e,a)
});
return a
},_findAnchorToComp:function(c,a){for(var b=0;
b<c.length;
b++){if(c[b].toComp===a){return c[b]
}}},_mergeSets:function(c,b){for(var a in b){c[a]=true
}},isReady:function(){return this._isReady
},clone:function(){return new this.$class()
}}});
W.Classes.newClass({name:"wysiwyg.viewer.managers.WViewManager",imports:["wysiwyg.viewer.managers.appdata.AppDataHandler"],Class:{Binds:["_fireScreenResizeEvent","_onSiteReady","_onPageNavigation","_setDocumentTitle"],Extends:"mobile.core.managers.ViewManagerBase",Static:{SCREEN_RESIZE_EVENT:"ScreenResize"},initialize:function(){this.parent();
this._isPageScrollToTopEnabled=false;
this.initScreenResizeEventPropagation();
this._registerCommands();
this.addHeightChangeCallback(function(){return W.Layout.getComponentMinResizeHeight(this.getSiteNode().getLogic())
}.bind(this))
},setSite:function(c,b,e){this.parent(c,b,e);
var d=this._siteNode.getElement("#SITE_PAGES");
if(d&&d.getProperty("comp")){this._pageGroupComp=d;
this._pageGroupComp.addEvent("pageTransitionEnded",this._onPageNavigation)
}var a=$(document.body);
if(this.getPreviewMode()){a.setStyle("overflow","hidden")
}else{a.setStyle("overflow-y","scroll");
a.setStyle("overflow-x","auto")
}},setAdData:function(a){this._adData=a
},getAdData:function(){return this._adData
},_onPageNavigation:function(a){this._setDocumentTitle(a);
W.Commands.executeCommand("WViewerCommands.MediaZoom.Close");
this.fireEvent("pageTransitionEnded",a)
},getSiteName:function(){return window.rendererModel.siteName
},getSiteTitleSEO:function(){return window.rendererModel.siteTitleSEO
},isPremiumUser:function(){var a=window.rendererModel;
if(!a||!a.premiumFeatures){return false
}return(a.premiumFeatures.length>0)
},_setDocumentTitle:function(f){var e="";
var c=W.Viewer.getPagesData()[f];
var h=c.get("pageTitleSEO")||"";
var a=c.get("title")||"";
var b=W.Viewer.getSiteTitleSEO()||"";
var g=W.Viewer.getSiteName()||"";
var d=W.Viewer.isHomePage(f);
if(d){e=b?b:g
}else{if(h){e=h
}else{e=(b)?b:g;
e+=(e)?" | ":"";
e+=a
}}if(!W.Viewer.isPremiumUser()){e+=(e)?" | ":"";
e+="Wix.com"
}if(e){document.title=e
}},_pageTransition:function(a){this._currentPageId=a;
if(this._pageGroupComp){this._pageGroupComp.getLogic().gotoPage(a)
}else{this.parent(a)
}},getDocWidth:function(){var a;
switch(window.rendererModel.applicationType){case"HtmlFacebook":a="520";
break;
case"HtmlWeb":a="980";
break;
default:a=980
}return a
},initScreenResizeEventPropagation:function(){$(window).addEvent("resize",this._fireScreenResizeEvent)
},indexPages:function(j){var a=this._siteNode.getElement(j);
if(!a){return W.Utils.callLater(this.indexPages,[j],this,10)
}var c={};
var b=[];
a.getElements("[comp=mobile.core.components.Page]").each(function(k){var i=k.get("id")||W.Utils.getUniqueId("page");
c[i]=k;
k.addClass("sitePage");
var l=k.get("dataQuery");
b.push(l)
}.bind(this));
var d=this._siteStructureData.getData().pages;
if(!d){d=[]
}for(var e=0;
e<d.length;
++e){var g=d[e];
var f=b.indexOf(g);
if(f!=-1){b.splice(f,1);
b.splice(e,0,g)
}}var h=W.Data.isDataChange();
this._siteStructureData.set("pages",b);
if(this._siteStructureData.get("mainPage")==undefined||this._siteStructureData.get("mainPage")==""){this._siteStructureData.set("mainPage",b[0])
}h&&W.Data.flagDataChange();
this._pages=c
},_fireScreenResizeEvent:function(){this.fireEvent(this.SCREEN_RESIZE_EVENT)
},_onSiteReady:function(){this.parent();
W.Layout.attachSavedAnchors();
this._fireScreenResizeEvent();
if(this.getSiteNode()&&this.getSiteNode().getLogic){this.siteHeightChanged()
}W.Utils.callLater(this._notifySiteReadyForThumbnail)
},_notifySiteReadyForThumbnail:function(){if(W.Utils.getQueryParam("siteReadyAlert")==="true"){window.alert("siteReady")
}var b=W.Utils.getQueryParam("siteReadyPost");
if(b){var a=new Request.JSON({url:b});
a.post({siteReady:true})
}},getSiteHeight:function(){return this._siteHeight
},setAdHeight:function(a){this._adHeight=a
},addHeightChangeCallback:function(a){this._heightChangeCallbacks=this._heightChangeCallbacks||[];
this._heightChangeCallbacks.push(a)
},_getHeightFromCallback:function(){if(!this._heightChangeCallbacks){return 0
}var a=0;
for(var b=0;
b<this._heightChangeCallbacks.length;
b++){a+=this._heightChangeCallbacks[b]()
}return a
},siteHeightChanged:function(a){this.getSiteNode().getLogic().flushPhysicalHeightCache();
this._siteHeight=this._getHeightFromCallback();
this.fireEvent("resize",this._siteHeight);
if(!a){this.getSiteNode().getLogic().setHeight(this._siteHeight)
}this._postHeightMessage()
},_postHeightMessage:function(){var a=parent.postMessage?parent:(parent.document.postMessage?parent.document:undefined);
if(a&&typeof a!="undefined"){a.postMessage(this._siteHeight,"*")
}},addOrientationEvent:function(a){},_getAllComponentsButPageContents:function(a){var b=a.getElements("[comp]");
if(a.get("comp")){b.push(a)
}return b.filter(function(d,c,e){return(d.getParent("[comp=mobile.core.components.Page]")==null)
})
},getPageGroup:function(){return this._siteNode.getElement("#SITE_PAGES").getLogic()
},_registerCommands:function(){var a=W.Commands;
a.registerCommandAndListener("WViewerCommands.SetMediaZoomImage",this,this.setMediaZoom);
a.registerCommandAndListener("WViewerCommands.AdminLogin.Open",this,this._openAdminLogin);
a.registerCommandAndListener("WViewerCommands.AdminLogin.Close",this,this._closeAdminLogin);
a.registerCommandListenerByName("WPreviewCommands.WEditModeChanged",this,this._onEditModeChanged);
this._registerMoreCommands(a)
},_registerMoreCommands:function(a){},_setMediaZoomItemAndShow:function(a){this._initIfNeededZoomMedia(function(){this._setMediaZoomDataInner({imageData:a});
this._mediaZoom.getLogic().showZoomImage()
}.bind(this))
},setMediaZoom:function(a){this._initIfNeededZoomMedia(function(){this._setMediaZoomDataInner(a)
}.bind(this))
},_openAdminLogin:function(){if(!this._adminLogin){var a=W.Data.createDataItem({type:"Text"});
W.Components.createComponent("wysiwyg.viewer.components.AdminLogin","wysiwyg.viewer.skins.AdminLoginSkin",a,null,function(){},function(d){this._adminLogin=d;
var b=d.getViewNode();
b.setStyle("opacity","0");
d.getViewNode().insertInto(this._siteNode);
d.centerDialog();
var c=new Fx.Tween(b,{duration:"short",link:"ignore"}).start("opacity","1.0")
}.bind(this))
}},_closeAdminLogin:function(){if(this._adminLogin){var a=this._adminLogin.getViewNode();
var b=new Fx.Tween(a,{duration:"short",link:"ignore"});
b.addEvent("complete",function(){b.removeEvent("complete",arguments.callee);
a.removeFromDOM();
delete this._adminLogin
}.bind(this));
b.start("opacity","0.0")
}},removeMediaZoom:function(){if(this._mediaZoom){this._mediaZoom.removeFromDOM();
delete this._mediaZoom
}},_setMediaZoomDataInner:function(a){if(a.mediaList){this._mediaZoom.getLogic().setGallery(a.mediaList,a.currentIndex)
}else{if(a.imageData){this._mediaZoom.getLogic().setImage(a.imageData)
}}},_initIfNeededZoomMedia:function(a){if(!this._mediaZoom){this._mediaZoom=W.Components.createComponent("wysiwyg.viewer.components.MediaZoom","wysiwyg.viewer.skins.MediaZoomSkin",null,null,function(b){b.getViewNode().insertInto(this._siteNode)
}.bind(this),a)
}else{if(a){a()
}}},enterFullScreenMode:function(){if(!this._isFullScreen){var a=!this.getPreviewMode()?$(document.body):$(window.parent.document.body);
this._originalBodyOverflow=a.getStyle("overflow");
a.setStyle("overflow","hidden");
this._isFullScreen=true
}},exitFullScreenMode:function(){if(this._isFullScreen){if(this._currentPageId){this._setUrlHashToPage(this._currentPageId)
}else{this.goToHomePage()
}var a=!this.getPreviewMode()?$(document.body):$(window.parent.document.body);
a.setStyle("overflow",this._originalBodyOverflow);
this._isFullScreen=false
}},_onHashChange:function(e){e=e||{};
if(this.isSiteReady()){var a=e.newHash;
var f=e.extData;
var d=e.isIdChanged;
var c=e.isExtDataChanged;
var b=e.silent;
if(!W.Data.isDataAvailable("#"+a)){this._changePageFromHash(a)
}else{if(d){W.Data.getDataByQuery("#"+a,function(g){this._onHashDataItemIdChange(a,g)
}.bind(this));
if(e.isForSureAfterChange){LOG.reportPageEvent(window.location.href)
}}}if(c){this._onPageExtraDataChange(f,a,b)
}}},_onHashDataItemIdChange:function(a,b){if(b.getType&&b.getType()==="Page"&&a){this._changePageFromHash(a)
}if(b.getType&&b.getType()==="Image"){this._setMediaZoomItemAndShow(b)
}},_onPageExtraDataChange:function(f,b,a){var c=this._getPageDataFromHash(b);
W.TPA.setPageState(b,f);
if(a){return
}var e=c.get("tpaApplicationId");
var d=W.TPA.getComponentRegistrar().getSection(e);
if(d){d._renderIfReady()
}},_setUrlHashToPage:function(a){var c=this._pagesData[a];
if(c){var b=W.TPA.getPageState(a);
W.Utils.hash.setHash(a,c.get("pageUriSEO"),b)
}},getAppDataHandler:function(){if(!this._appDataHandler){this._appDataHandler=new this.imports.AppDataHandler()
}return this._appDataHandler
}}});
W.Classes.newClass({name:"wysiwyg.viewer.managers.WCookiesManager",Class:{Extends:"mobile.core.managers.BaseManager",_initializeExtra:function(){},setCookieParam:function(a,e){var c;
var b=this.getCookie(a);
if(b){if(this.getCookieParams(a).indexOf(e)>=0){return
}c=a+"="+b+","+e
}else{c=a+"="+e
}var d=this.writeCookie(c);
return d
},getCookieParams:function(a){var f=a+"=";
var e=document.cookie.split(";");
for(var c=0;
c<e.length;
c++){var b=e[c];
while(b.charAt(0)==" "){b=b.substring(1,b.length)
}if(b.indexOf(f)==0){var d=b.substring(f.length,b.length);
return d.split(",")
}}return[]
},removeCookieParam:function(a,d){var e=this.getCookieParams(a);
if(!(e.length>0)){return
}var f=e.indexOf(d);
if(f<0){return
}e.splice(f,1);
var b=a+"="+e.toString();
var c=this.writeCookie(b);
return c
},removeCookie:function(a){this.writeCookie(a+"=")
},writeCookie:function(c,f,d,e){var b;
if(f){b=(new Date((new Date()).getTime()+f))
}else{var a=new Date();
a.setYear((new Date().getFullYear()+1));
b=a
}c+=";expires="+b.toGMTString();
c+=";path="+(e||"/");
if(d){c+=";domain="+d
}document.cookie=c;
return c
},getCookie:function(a){if(document.cookie){var e=document.cookie.split(/;\s*/);
for(var d=0,f=e.length;
d<f;
d++){var c=e[d];
var b=a+"=";
if(c.indexOf(b)==0){return c.substring(b.length,c.length)
}}}return false
},isReady:function(){return true
},clone:function(){return this.parent()
}}});
W.Classes.newClass({name:"wysiwyg.viewer.managers.HtmlScriptsLoader",Class:{Extends:"mobile.core.managers.HtmlScriptsLoader",Binds:["_waitForMobileToBeReady"],_nonIndexedScriptFiles:["core-data-types.js"],_scriptFiles:["core-data-types.js","web-viewer-components.js","javascript/wysiwyg/viewer/managers/deployment/Deploy.js"],_start:function(){var a=W.Classes.get("wysiwyg.core.deployment.MobileHtmlScriptsLoader");
this._mobileHtmlScriptsLoader=new a("MODE_EDITOR");
this._isMobileReady=false;
if(this._isInDebugMode()){this._waitForMobileToBeReady()
}},_waitForMobileToBeReady:function(){if(this._mobileHtmlScriptsLoader.isReady()){this._isMobileReady=true;
this._startEditorLoad()
}else{setTimeout(this._waitForMobileToBeReady,10)
}},_startEditorLoad:function(){if(!this.isReady()){this._loadProgress=0;
if(this._isInDebugMode()){this._getIndexJson()
}else{this._loadMinifiedScripts()
}}},notifyScriptLoad:function(){this._loadProgress++;
if(!this._isMobileReady&&this._loadProgress==this._mobileHtmlScriptsLoader._scriptFiles.length){this._isMobileReady=true;
this._startEditorLoad()
}}}});
W.Classes.newClass({name:"wysiwyg.viewer.managers.TPAManager",imports:["wysiwyg.viewer.managers.tpa.URLBuilder","wysiwyg.viewer.managers.tpa.TPAComponentRegistrar"],Class:{Extends:"mobile.core.managers.BaseManager",Binds:["_waitForAppAlive"],Static:{TPA_MESSAGE:"TPA",APP_MARKET_MESSAGE:"APP_MARKET",PINGPONG_PREFIX:"pingpong:",MAX_LOAD_RETRIES:20,MessageTypes:{HEIGHT_CHANGED:"heightChanged",APP_SETTINGS_CHANGED:"appSettingsChanged",APP_IS_ALIVE:"appIsAlive",APP_SETTINGS_CLOSE:"appSettingsClose",APP_STATE_CHANGED:"appStateChanged",SM_REQUEST_LOGIN:"pingpong:smRequestLogin",SM_CURRENT_MEMBER:"pingpong:smCurrentMember",SITE_INFO:"pingpong:siteInfo"}},initialize:function(){this._urlBuilder=new this.imports.URLBuilder();
this._componentRegistrar=new this.imports.TPAComponentRegistrar();
this._loadAttempts={};
this._addPostMessageCallback(function(a){this.handlePostMessage(a,function(b){var c=$(b);
return c&&c.getLogic()
})
}.bind(this))
},isReady:function(){return true
},_addPostMessageCallback:function(c){var b="addEventListener";
var a="message";
if(Browser.ie&&window.attachEvent){b="attachEvent";
a="onmessage"
}window[b](a,c,false)
},handlePostMessage:function(c,d){if(typeof(c.data)!="string"){return
}var a=JSON.parse(c.data);
var b=a.type;
if(a&&a.intent){if(a.intent==this.TPA_MESSAGE&&b){this._handleTPAMessage(a,b,d)
}else{if(a.intent===this.APP_MARKET_MESSAGE){this._handleAppMarketMessage(a)
}}}},_handleTPAMessage:function(a,b,g){var d=a.compId;
var c=g(d);
if(!c){return
}if(Object.contains(this.MessageTypes,b)){var e=this._getHandlerFunctionName(b);
var f=c[e];
if(f){if(this._isPingPongMessage(b)){if(c.isInstanceOfClass("wysiwyg.viewer.components.IFrameComponent")){f.apply(c,[{msgData:a.data,callback:function(i){var h=c.getIFrame();
h.contentWindow.postMessage({intent:this.TPA_MESSAGE,compId:d,type:b,data:i},"*")
}.bind(this)}])
}}else{f.apply(c,[a.data])
}}else{LOG.reportError("Handler function not found - "+b,"wysiwyg.viewer.managers.TPA","handlePostMessage")
}}else{LOG.reportError("Unknown post message type - "+b,"wysiwyg.viewer.managers.TPA","handlePostMessage")
}},_handleAppMarketMessage:function(a){},_getHandlerFunctionName:function(a){if(this._isPingPongMessage(a)){a=a.replace(this.PINGPONG_PREFIX,"")
}return"handle"+a.capitalize()
},_isPingPongMessage:function(a){return(a.indexOf(this.PINGPONG_PREFIX)==0)
},getURLBuilder:function(){return this._urlBuilder
},getComponentRegistrar:function(){return this._componentRegistrar
},getSectionURL:function(g){var a=this._componentRegistrar.getPageId(g);
var c=W.Data.getDataByQuery("#"+a);
var e=c&&c.get("title");
var f=this.getPageState(a);
var b=this.injects().Viewer.isPublicMode();
var d=location.href.replace(location.hash,"");
d=!b?d:((window.publicModel&&window.publicModel["externalBaseUrl"])||d);
return d+"#!"+this.injects().Utils.hash.getHashPartsString(a,e,f)
},reportLoadStart:function(a){this._waitForAppAlive(a)
},_waitForAppAlive:function(a){if(W.Config.isInDebugMode()){return
}var b=a.getComponentId();
if(!a.isAppAlive()){if(!this._loadAttempts.hasOwnProperty(b)){this._loadAttempts[b]=0
}this._loadAttempts[b]+=1;
if(this._loadAttempts[b]>this.MAX_LOAD_RETRIES){this.showAppNotAvailable(a)
}else{a.callLater(this._waitForAppAlive,[a],500)
}}else{this._loadAttempts[b]=0
}},showAppNotAvailable:function(a){if(a.isRendered()){a.setUrl(W.Config.getServiceTopologyProperty("scriptsRoot")+"/html/external/apps404.html")
}LOG.reportError(wixErrors.APPS_OPEN_TIMEOUT,this.$className,"showAppNotAvailable")
},setPageState:function(a,b){if(!this._stateByPage){this._stateByPage={}
}this._stateByPage[a]=b
},getPageState:function(a){var b=this._stateByPage&&this._stateByPage[a];
return b||""
},dispose:function(){window.removeEventListener("message",this.handlePostMessage,false);
this.parent()
}}});
W.Managers.list.combine([{Class:"wysiwyg.viewer.managers.LayoutManager",target:"Layout"},{Class:"wysiwyg.viewer.managers.WCookiesManager",target:"CookiesManager"},{Class:"wysiwyg.viewer.managers.TPAManager",target:"TPA"}]);
W.Managers.override([{Class:"wysiwyg.viewer.managers.WViewManager",target:"Viewer"},{Class:"wysiwyg.viewer.managers.HtmlScriptsLoader",target:"HtmlScriptsLoader"}]);