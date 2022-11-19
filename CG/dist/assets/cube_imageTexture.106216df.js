import"./modulepreload-polyfill.c7c6310f.js";import{c as G,a as M,b as R,d as w,e as p,p as C,f as A,t as O,g as b,r as z,m as N}from"./vec3.aa6065a3.js";const q=`struct Uniforms {
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
`,D=`@group(1) @binding(0) var Sampler: sampler;
@group(1) @binding(1) var Texture: texture_2d<f32>;

@fragment
fn main(
  @location(0) fragUV: vec2<f32>,
  @location(1) fragPosition: vec4<f32>
) -> @location(0) vec4<f32> {
  return textureSample(Texture, Sampler, fragUV) * fragPosition;
}`,F="../assets/texture.148c50b5.webp";async function L(e){if(!navigator.gpu)throw new Error("Not Support WebGPU");const t=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!t)throw new Error("No Adapter Found");const r=await t.requestDevice(),n=e.getContext("webgpu"),o=navigator.gpu.getPreferredCanvasFormat(),c=window.devicePixelRatio||1,u={width:e.clientWidth*c,height:e.clientHeight*c};return e.width=u.width,e.height=u.height,n.configure({device:r,format:o,alphaMode:"opaque"}),{device:r,context:n,format:o,presentationSize:u}}async function I(e,t){const r={vertex:{module:e.createShaderModule({code:q}),entryPoint:"main",buffers:[{arrayStride:G,attributes:[{shaderLocation:0,offset:M,format:"float32x4"},{shaderLocation:1,offset:R,format:"float32x2"}]}]},fragment:{module:e.createShaderModule({code:D}),entryPoint:"main",targets:[{format:t}]},primitive:{topology:"triangle-list",cullMode:"back"},depthStencil:{depthWriteEnabled:!0,depthCompare:"less",format:"depth24plus"},layout:"auto"};return await e.createRenderPipelineAsync(r)}async function P(e,t,r,n){const o=e.createBuffer({size:w.byteLength,usage:GPUBufferUsage.VERTEX,mappedAtCreation:!0});new Float32Array(o.getMappedRange()).set(w),o.unmap();const c={width:n.clientWidth*devicePixelRatio,height:n.clientHeight*devicePixelRatio},u=e.createTexture({size:c,format:"depth24plus",usage:GPUTextureUsage.RENDER_ATTACHMENT}),T=4*16,l=e.createBuffer({size:T,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),U=e.createBindGroup({layout:r.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:l}}]}),d={colorAttachments:[{view:t.getCurrentTexture().createView(),loadOp:"clear",clearValue:{r:.2,g:.3,b:.3,a:1},storeOp:"store"}],depthStencilAttachment:{view:u.createView(),depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"store"}},V=n.width/n.height,g=p();C(g,2*Math.PI/5,V,1,1e3);function y(){const i=p();O(i,i,b(0,0,-6));const s=Date.now()/1e3;z(i,i,1,b(Math.sin(s),Math.cos(s),0));const a=p();return N(a,g,i),a}const v=await(await fetch(F)).blob(),f=await createImageBitmap(v),m=[f.width,f.height],h=e.createTexture({size:m,format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT});e.queue.copyExternalImageToTexture({source:f},{texture:h},m);const B=e.createSampler({magFilter:"linear",minFilter:"linear"}),S=e.createBindGroup({label:"Texture Group with Texture & Sampler",layout:r.getBindGroupLayout(1),entries:[{binding:0,resource:B},{binding:1,resource:h.createView()}]});function x(){const i=y();e.queue.writeBuffer(l,0,i.buffer,i.byteOffset,i.byteLength),d.colorAttachments[0].view=t.getCurrentTexture().createView();const s=e.createCommandEncoder(),a=s.beginRenderPass(d);a.setPipeline(r),a.setBindGroup(0,U),a.setBindGroup(1,S),a.setVertexBuffer(0,o),a.draw(A,1,0,0),a.end();const E=s.finish();e.queue.submit([E]),requestAnimationFrame(x)}x()}async function W(){const e=document.querySelector("canvas");if(!e)throw new Error("No Canvas");const{device:t,context:r,format:n}=await L(e),o=await I(t,n);P(t,r,o,e),window.addEventListener("resize",()=>{e.width=e.clientWidth*devicePixelRatio,e.height=e.clientHeight*devicePixelRatio,r.configure({device:t,format:n,alphaMode:"opaque"}),P(t,r,o,e)})}W();
