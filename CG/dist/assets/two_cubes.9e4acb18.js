import"./modulepreload-polyfill.c7c6310f.js";import{c as O,a as R,b as T,d as P,e as f,p as z,f as b,t as M,g as l,r as V,m as v}from"./vec3.aa6065a3.js";const q=`struct Uniforms {
  modelViewProjectionMatrix : mat4x4<f32>,
}
@binding(0) @group(0) var<uniform> uniforms : Uniforms;

struct VertexOutput {
  @builtin(position) Position : vec4<f32>,
  @location(0) fragUV : vec2<f32>,
  @location(1) fragPosition: vec4<f32>,
}

@vertex
fn main(
  @location(0) position : vec4<f32>,
  @location(1) uv : vec2<f32>
) -> VertexOutput {
  var output : VertexOutput;
  output.Position = uniforms.modelViewProjectionMatrix * position;
  output.fragUV = uv;
  output.fragPosition = 0.5 * (position + vec4<f32>(1.0, 1.0, 1.0, 1.0));
  return output;
}
`,L=`@fragment
fn main(
  @location(0) fragUV: vec2<f32>,
  @location(1) fragPosition: vec4<f32>
) -> @location(0) vec4<f32> {
  return fragPosition;
}`;async function F(e){if(!navigator.gpu)throw new Error("Not Support WebGPU");const r=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!r)throw new Error("No Adapter Found");const o=await r.requestDevice(),n=e.getContext("webgpu"),i=navigator.gpu.getPreferredCanvasFormat(),d=window.devicePixelRatio||1,c={width:e.clientWidth*d,height:e.clientHeight*d};return e.width=c.width,e.height=c.height,n.configure({device:o,format:i,alphaMode:"opaque"}),{device:o,context:n,format:i,presentationSize:c}}async function D(e,r){const o={vertex:{module:e.createShaderModule({code:q}),entryPoint:"main",buffers:[{arrayStride:O,attributes:[{shaderLocation:0,offset:R,format:"float32x4"},{shaderLocation:1,offset:T,format:"float32x2"}]}]},fragment:{module:e.createShaderModule({code:L}),entryPoint:"main",targets:[{format:r}]},primitive:{topology:"triangle-list",cullMode:"back"},depthStencil:{depthWriteEnabled:!0,depthCompare:"less",format:"depth24plus"},layout:"auto"};return await e.createRenderPipelineAsync(o)}function y(e,r,o,n){const i=e.createBuffer({size:P.byteLength,usage:GPUBufferUsage.VERTEX,mappedAtCreation:!0});new Float32Array(i.getMappedRange()).set(P),i.unmap();const d={width:n.clientWidth*devicePixelRatio,height:n.clientHeight*devicePixelRatio},c=e.createTexture({size:d,format:"depth24plus",usage:GPUTextureUsage.RENDER_ATTACHMENT}),m=4*16,g=256,B=g+m,p=e.createBuffer({size:B,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),U=e.createBindGroup({layout:o.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:p,offset:0,size:m}}]}),G=e.createBindGroup({layout:o.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:p,offset:g,size:m}}]}),w={colorAttachments:[{view:r.getCurrentTexture().createView(),loadOp:"clear",clearValue:{r:.2,g:.3,b:.3,a:1},storeOp:"store"}],depthStencilAttachment:{view:c.createView(),depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"store"}},S=n.width/n.height,h=f();z(h,2*Math.PI/5,S,1,1e3);function A(){const t=f();M(t,t,l(2,0,-10));const a=Date.now()/1e3;V(t,t,1,l(Math.sin(a),Math.cos(a),0));const s=f();return v(s,h,t),s}function C(){const t=f();M(t,t,l(-2,0,-10));const a=Date.now()/1e3;V(t,t,1,l(Math.sin(a),Math.cos(a),0));const s=f();return v(s,h,t),s}function x(){const t=A();e.queue.writeBuffer(p,0,t.buffer,t.byteOffset,t.byteLength);const a=C();e.queue.writeBuffer(p,g,a.buffer,a.byteOffset,a.byteLength),w.colorAttachments[0].view=r.getCurrentTexture().createView();const s=e.createCommandEncoder(),u=s.beginRenderPass(w);u.setPipeline(o),u.setVertexBuffer(0,i),u.setBindGroup(0,U),u.draw(b,1,0,0),u.setBindGroup(0,G),u.draw(b,1,0,0),u.end();const E=s.finish();e.queue.submit([E]),requestAnimationFrame(x)}requestAnimationFrame(x)}async function N(){const e=document.querySelector("canvas");if(!e)throw new Error("No Canvas");const{device:r,context:o,format:n}=await F(e),i=await D(r,n);y(r,o,i,e),window.addEventListener("resize",()=>{e.width=e.clientWidth*devicePixelRatio,e.height=e.clientHeight*devicePixelRatio,o.configure({device:r,format:n,alphaMode:"opaque"}),y(r,o,i,e)})}N();
