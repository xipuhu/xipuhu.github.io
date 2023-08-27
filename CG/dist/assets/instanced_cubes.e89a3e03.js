import"./modulepreload-polyfill.b7f2da20.js";import{c as F,a as L,b as D,d as C,e as w,p as N,t as S,g as v,f as E,r as W,m as R}from"./vec3.aa6065a3.js";const I=`struct Uniforms {
  modelViewProjectionMatrix : array<mat4x4<f32>, 16>,
}
@binding(0) @group(0) var<uniform> uniforms : Uniforms;

struct VertexOutput {
  @builtin(position) Position : vec4<f32>,
  @location(0) fragUV : vec2<f32>,
  @location(1) fragPosition: vec4<f32>,
}

@vertex
fn main(
  @builtin(instance_index) instanceIdx : u32,
  @location(0) position : vec4<f32>,
  @location(1) uv : vec2<f32>
) -> VertexOutput {
  var output : VertexOutput;
  output.Position = uniforms.modelViewProjectionMatrix[instanceIdx] * position;
  output.fragUV = uv;
  output.fragPosition = 0.5 * (position + vec4<f32>(1.0, 1.0, 1.0, 1.0));
  return output;
}
`,H=`@fragment
fn main(
  @location(0) fragUV: vec2<f32>,
  @location(1) fragPosition: vec4<f32>
) -> @location(0) vec4<f32> {
  return fragPosition;
}`;async function j(e){if(!navigator.gpu)throw new Error("Not Support WebGPU");const n=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!n)throw new Error("No Adapter Found");const r=await n.requestDevice(),o=e.getContext("webgpu"),i=navigator.gpu.getPreferredCanvasFormat(),u=window.devicePixelRatio||1,c={width:e.clientWidth*u,height:e.clientHeight*u};return e.width=c.width,e.height=c.height,o.configure({device:r,format:i,alphaMode:"opaque"}),{device:r,context:o,format:i,presentationSize:c}}async function _(e,n){const r={vertex:{module:e.createShaderModule({code:I}),entryPoint:"main",buffers:[{arrayStride:F,attributes:[{shaderLocation:0,offset:L,format:"float32x4"},{shaderLocation:1,offset:D,format:"float32x2"}]}]},fragment:{module:e.createShaderModule({code:H}),entryPoint:"main",targets:[{format:n}]},primitive:{topology:"triangle-list",cullMode:"back"},depthStencil:{depthWriteEnabled:!0,depthCompare:"less",format:"depth24plus"},layout:"auto"};return await e.createRenderPipelineAsync(r)}function O(e,n,r,o){const i=e.createBuffer({size:C.byteLength,usage:GPUBufferUsage.VERTEX,mappedAtCreation:!0});new Float32Array(i.getMappedRange()).set(C),i.unmap();const u={width:o.clientWidth*devicePixelRatio,height:o.clientHeight*devicePixelRatio},c=e.createTexture({size:u,format:"depth24plus",usage:GPUTextureUsage.RENDER_ATTACHMENT}),y={colorAttachments:[{view:n.getCurrentTexture().createView(),loadOp:"clear",clearValue:{r:.2,g:.3,b:.3,a:1},storeOp:"store"}],depthStencilAttachment:{view:c.createView(),depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"store"}},f=4,p=4,d=f*p,G=4*16,T=d*G,V=e.createBuffer({size:T,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),M=e.createBindGroup({layout:r.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:V}}]}),q=o.width/o.height,U=w();N(U,2*Math.PI/5,q,1,1e3);const l=new Array(d),m=new Float32Array(16*d),B=4;let g=0;for(let a=0;a<f;++a)for(let t=0;t<p;++t)l[g]=w(),S(l[g],l[g],v(B*(a-f/2+.5),B*(t-p/2+.5),0)),++g;const x=w();S(x,x,v(0,0,-16));const s=w();function z(){const a=Date.now()/1e3;let t=0,h=0;for(let P=0;P<f;++P)for(let b=0;b<p;++b)W(s,l[h],1,v(Math.sin((P+.5)*a),Math.cos((b+.5)*a),0)),R(s,x,s),R(s,U,s),m.set(s,t),++h,t+=16}function A(){z(),e.queue.writeBuffer(V,0,m.buffer,m.byteOffset,m.byteLength),y.colorAttachments[0].view=n.getCurrentTexture().createView();const a=e.createCommandEncoder(),t=a.beginRenderPass(y);t.setPipeline(r),t.setVertexBuffer(0,i),t.setBindGroup(0,M),t.draw(E,1,0,0),t.setBindGroup(0,M),t.draw(E,d,0,0),t.end();const h=a.finish();e.queue.submit([h]),requestAnimationFrame(A)}requestAnimationFrame(A)}async function k(){const e=document.querySelector("canvas");if(!e)throw new Error("No Canvas");const{device:n,context:r,format:o}=await j(e),i=await _(n,o);O(n,r,i,e),window.addEventListener("resize",()=>{e.width=e.clientWidth*devicePixelRatio,e.height=e.clientHeight*devicePixelRatio,r.configure({device:n,format:o,alphaMode:"opaque"}),O(n,r,i,e)})}k();
