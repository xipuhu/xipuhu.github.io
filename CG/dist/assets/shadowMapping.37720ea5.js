import"./modulepreload-polyfill.b7f2da20.js";import{v,i as y,a as b,b as G,g as P,c as D,d as V,e as M}from"./math.b4722385.js";import{c as T,f as B,l as S,o as E,m as R}from"./vec3.1fdabb87.js";var A=`@group(0) @binding(0) var<storage> modelViews: array<mat4x4<f32>>;
@group(0) @binding(1) var<uniform> cameraProjection: mat4x4<f32>;
@group(0) @binding(2) var<uniform> lightProjection: mat4x4<f32>;
@group(0) @binding(3) var<storage> colors: array<vec4<f32>>;

struct VertexOutput{
    @builtin(position) Position: vec4<f32>,
    @location(0) fragPosition: vec3<f32>,
    @location(1) fragNormal: vec3<f32>,
    @location(2) fragUV: vec2<f32>,
    @location(3) shadowPos: vec3<f32>,
    @location(4) fragColor: vec4<f32>
};

@vertex
fn main(
    @builtin(instance_index) index: u32,
    @location(0) position: vec3<f32>,
    @location(1) normal: vec3<f32>,
    @location(2) uv: vec2<f32>
) -> VertexOutput {
    let modelView = modelViews[index];
    let pos = vec4<f32>(position, 1.0);
    let posFromCamera: vec4<f32> = cameraProjection * modelView * pos;

    var output: VertexOutput;
    output.Position = posFromCamera;
    output.fragPosition = (modelView * pos).xyz;
    output.fragNormal = (modelView * vec4<f32>(normal, 0.0)).xyz;
    output.fragUV = uv;
    output.fragColor = colors[index];

    let posFromLight: vec4<f32> = lightProjection * modelView * pos;
    // \u5C06shadowPos XY\u8F6C\u6362\u4E3A[0, 1]\u8FD9\u4E2A\u8303\u56F4\u4EE5\u9002\u5E94\u7EB9\u7406UV
    output.shadowPos = vec3<f32>(posFromLight.xy * vec2<f32>(0.5, -0.5) + vec2<f32>(0.5, 0.5), posFromLight.z);
   
   return output;
}`,N=`@group(1) @binding(0) var<uniform> lightPosition: vec4<f32>;
@group(1) @binding(1) var shadowMap: texture_depth_2d;
@group(1) @binding(2) var shadowSampler: sampler_comparison;

@fragment
fn main(
    @location(0) fragPosition: vec3<f32>,
    @location(1) fragNormal: vec3<f32>,
    @location(2) fragUV: vec2<f32>,
    @location(3) shadowPos: vec3<f32>,
    @location(4) fragColor: vec4<f32>
) ->@location(0) vec4<f32> {
    let objectColor = fragColor.rgb;
    let diffuse: f32 = max(dot(normalize(lightPosition.xyz), fragNormal), 0.0);
    var shadow: f32 = 0.0;

    let size = f32(textureDimensions(shadowMap).x);
    for (var y: i32 = -1; y <= 1; y = y + 1) {
        for (var x: i32 = -1; x <= 1; x = x + 1) {
            let offset = vec2<f32>(f32(x) / size, f32(y) / size);
            shadow = shadow + textureSampleCompare(
                shadowMap,
                shadowSampler,
                shadowPos.xy + offset,
                shadowPos.z - 0.005  // \u52A0\u4E00\u4E2A0.005\u7684\u504F\u79FB\u53EF\u4EE5\u907F\u514D\u51FA\u73B0\u6469\u5C14\u7EB9
            );
        }
    }
    shadow = shadow / 9.0;
    let lightFactor = min(0.3 + shadow * diffuse, 1.0);

    return vec4<f32>(objectColor * lightFactor, 1.0);
}`,_=`@group(0) @binding(0) var<storage> modelViews: array<mat4x4<f32>>;
@group(0) @binding(1) var<uniform> lightProjection: mat4x4<f32>;

@vertex
fn main(
    @builtin(instance_index) index: u32,
    @location(0) position: vec3<f32>,
    @location(1) normal: vec3<f32>,
    @location(2) uv: vec2<f32>
) -> @builtin(position) vec4<f32> {
    let modelView = modelViews[index];
    let pos = vec4(position, 1.0);
    return lightProjection * modelView * pos;
}`;const d=30;async function F(e){if(!navigator.gpu)throw new Error("Not Support WebGPU");const i=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!i)throw new Error("No Adapter Found");const c=await i.requestDevice(),o=e.getContext("webgpu"),n=navigator.gpu.getPreferredCanvasFormat(),s=window.devicePixelRatio||1,r={width:e.clientWidth*s,height:e.clientHeight*s};return e.width=r.width,e.height=r.height,o.configure({device:c,format:n,alphaMode:"opaque"}),{device:c,context:o,format:n,presentationSize:r}}async function I(e,i){const c=[{arrayStride:32,attributes:[{shaderLocation:0,offset:0,format:"float32x3"},{shaderLocation:1,offset:12,format:"float32x3"},{shaderLocation:2,offset:24,format:"float32x2"}]}],o={topology:"triangle-list",cullMode:"back"},n={depthWriteEnabled:!0,depthCompare:"less",format:"depth32float"},s=await e.createRenderPipelineAsync({label:"Shadow Pipeline",layout:"auto",vertex:{module:e.createShaderModule({code:_}),entryPoint:"main",buffers:c},primitive:o,depthStencil:n}),r=await e.createRenderPipelineAsync({label:"Render Target Pipeline",layout:"auto",vertex:{module:e.createShaderModule({code:A}),entryPoint:"main",buffers:c},fragment:{module:e.createShaderModule({code:N}),entryPoint:"main",targets:[{format:i}]},primitive:o,depthStencil:n});return{shadowPipeline:s,renderPipeline:r}}async function q(e,i,c){const o={vertex:e.createBuffer({label:"GPUBuffer store vertex",size:v.byteLength,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST}),index:e.createBuffer({label:"GPUBuffer store vertex index",size:y.byteLength,usage:GPUBufferUsage.INDEX|GPUBufferUsage.COPY_DST})},n={vertex:e.createBuffer({label:"GPUBuffer store vertex",size:b.byteLength,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST}),index:e.createBuffer({label:"GPUBuffer store vertex index",size:G.byteLength,usage:GPUBufferUsage.INDEX|GPUBufferUsage.COPY_DST})};e.queue.writeBuffer(o.vertex,0,v),e.queue.writeBuffer(o.index,0,y),e.queue.writeBuffer(n.vertex,0,b),e.queue.writeBuffer(n.index,0,G);const s={width:i.clientWidth*devicePixelRatio,height:i.clientHeight*devicePixelRatio},r=e.createTexture({size:[2048,2048],format:"depth32float",usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),p=e.createTexture({size:s,format:"depth32float",usage:GPUTextureUsage.RENDER_ATTACHMENT}),l=r.createView(),h=p.createView(),m=e.createBuffer({label:"GPUBuffer sotre n*4x4 matrix",size:4*4*4*d,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),w=e.createBuffer({label:"GPUBuffer sotre 4x4 matrix",size:4*4*4,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),x=e.createBuffer({label:"GPUBuffer sotre 4x4 matrix",size:4*4*4,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),f=e.createBuffer({label:"GPUBuffer sotre n*4 color",size:4*4*d,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),u=e.createBuffer({label:"GPUBuffer store 4x4 matrix",size:4*4,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),a=e.createBindGroup({label:"Uniform Group with matrix",layout:c.renderPipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:m}},{binding:1,resource:{buffer:w}},{binding:2,resource:{buffer:x}},{binding:3,resource:{buffer:f}}]}),t=e.createBindGroup({label:"Group for fragment",layout:c.renderPipeline.getBindGroupLayout(1),entries:[{binding:0,resource:{buffer:u}},{binding:1,resource:l},{binding:2,resource:e.createSampler({compare:"less"})}]}),g=e.createBindGroup({label:"binding group for shadowPass",layout:c.shadowPipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:m}},{binding:1,resource:{buffer:x}}]});return{boxBuffer:o,sphereBuffer:n,modelViewBuffer:m,cameraProjectionBuffer:w,lightProjectionBuffer:x,colorBuffer:f,lightBuffer:u,vsGroup:a,fsGroup:t,shadowGroup:g,renderDepthTexture:p,renderDepthView:h,shadowDepthTexture:r,shadowDepthView:l}}function z(e,i,c,o){const n=[],s=new Float32Array(d*4*4),r=new Float32Array(d*4);{const f={x:0,y:0,z:-20},u={x:0,y:Math.PI/4,z:0},a={x:2,y:20,z:2},t=P(f,u,a);s.set(t,0*4*4),r.set([.5,.5,.5,1],0*4),n.push({position:f,rotation:u,scale:a})}{const f={x:0,y:-10,z:-20},u={x:0,y:0,z:0},a={x:50,y:.5,z:40},t=P(f,u,a);s.set(t,1*4*4),r.set([1,1,1,1],1*4),n.push({position:f,rotation:u,scale:a})}for(let f=2;f<d;++f){const u=Math.random()>.5?1:-1,a={x:(1+Math.random()*12)*u,y:-8+Math.random()*15,z:-20+(1+Math.random()*12)*u},t={x:Math.random(),y:Math.random(),z:Math.random()},g=Math.max(.5,Math.random()),U={x:g,y:g,z:g},C=P(a,t,U);s.set(C,f*4*4),r.set([Math.random(),Math.random(),Math.random(),1],f*4),n.push({position:a,rotation:t,scale:U,y:a.y,v:Math.max(.09,Math.random()/10)*u})}e.queue.writeBuffer(o.colorBuffer,0,r);const p=T(),l=T(),h=B(0,100,0),m=B(0,1,0),w=B(0,0,0);function x(){const f=performance.now();h[0]=Math.sin(f/1500)*50,h[2]=Math.cos(f/1500)*50,S(p,h,w,m),E(l,-40,40,-40,40,-50,200),R(l,l,p),e.queue.writeBuffer(o.lightProjectionBuffer,0,l),e.queue.writeBuffer(o.lightBuffer,0,h);for(let a=2;a<d;++a){const t=n[a];t.position.y+=t.v,(t.position.y<-9||t.position.y>9)&&(t.v*=-1);const g=P(t.position,t.rotation,t.scale);s.set(g,a*4*4)}e.queue.writeBuffer(o.modelViewBuffer,0,s);const u=e.createCommandEncoder();{const a={colorAttachments:[],depthStencilAttachment:{view:o.shadowDepthView,depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"store"}},t=u.beginRenderPass(a);t.setPipeline(c.shadowPipeline),t.setBindGroup(0,o.shadowGroup),t.setVertexBuffer(0,o.boxBuffer.vertex),t.setIndexBuffer(o.boxBuffer.index,"uint16"),t.drawIndexed(V,2,0,0,0),t.setVertexBuffer(0,o.sphereBuffer.vertex),t.setIndexBuffer(o.sphereBuffer.index,"uint16"),t.drawIndexed(M,d-2,0,0,d/2),t.end()}{const a={colorAttachments:[{view:i.getCurrentTexture().createView(),loadOp:"clear",clearValue:{r:.2,g:.3,b:.3,a:1},storeOp:"store"}],depthStencilAttachment:{view:o.renderDepthView,depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"store"}},t=u.beginRenderPass(a);t.setPipeline(c.renderPipeline),t.setBindGroup(0,o.vsGroup),t.setBindGroup(1,o.fsGroup),t.setVertexBuffer(0,o.boxBuffer.vertex),t.setIndexBuffer(o.boxBuffer.index,"uint16"),t.drawIndexed(V,2,0,0,0),t.setVertexBuffer(0,o.sphereBuffer.vertex),t.setIndexBuffer(o.sphereBuffer.index,"uint16"),t.drawIndexed(M,d-2,0,0,d/2),t.end()}e.queue.submit([u.finish()]),requestAnimationFrame(x)}requestAnimationFrame(x)}async function L(){const e=document.querySelector("canvas");if(!e)throw new Error("No Canvas");const{device:i,context:c,format:o,presentationSize:n}=await F(e),s=await I(i,o),r=await q(i,e,s);z(i,c,s,r);function p(){const l=n.width/n.height,h=D(l,60/180*Math.PI,.1,1e3,{x:0,y:10,z:20});i.queue.writeBuffer(r.cameraProjectionBuffer,0,h)}p(),window.addEventListener("resize",()=>{n.width=e.width=e.clientWidth*devicePixelRatio,n.width=e.height=e.clientHeight*devicePixelRatio,r.renderDepthTexture.destroy(),r.renderDepthTexture=i.createTexture({size:n,format:"depth32float",usage:GPUTextureUsage.RENDER_ATTACHMENT}),r.renderDepthView=r.renderDepthTexture.createView(),z(i,c,s,r),p()})}L();
