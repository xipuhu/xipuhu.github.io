import"./modulepreload-polyfill.b7f2da20.js";import{c as y,a as M,b as U,d as m,e as f,p as B,f as A,t as C,g as h,r as E,m as R}from"./vec3.aa6065a3.js";var S=`struct Uniforms {
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
`,O=`@fragment
fn main(
  @location(0) fragUV: vec2<f32>,
  @location(1) fragPosition: vec4<f32>
) -> @location(0) vec4<f32> {
  return fragPosition;
}`;async function T(e){if(!navigator.gpu)throw new Error("Not Support WebGPU");const t=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!t)throw new Error("No Adapter Found");const r=await t.requestDevice(),o=e.getContext("webgpu"),n=navigator.gpu.getPreferredCanvasFormat(),c=window.devicePixelRatio||1,u={width:e.clientWidth*c,height:e.clientHeight*c};return e.width=u.width,e.height=u.height,o.configure({device:r,format:n,alphaMode:"opaque"}),{device:r,context:o,format:n,presentationSize:u}}async function G(e,t){const r={vertex:{module:e.createShaderModule({code:S}),entryPoint:"main",buffers:[{arrayStride:y,attributes:[{shaderLocation:0,offset:M,format:"float32x4"},{shaderLocation:1,offset:U,format:"float32x2"}]}]},fragment:{module:e.createShaderModule({code:O}),entryPoint:"main",targets:[{format:t}]},primitive:{topology:"triangle-list",cullMode:"back"},depthStencil:{depthWriteEnabled:!0,depthCompare:"less",format:"depth24plus"},layout:"auto"};return await e.createRenderPipelineAsync(r)}function w(e,t,r,o){const n=e.createBuffer({size:m.byteLength,usage:GPUBufferUsage.VERTEX,mappedAtCreation:!0});new Float32Array(n.getMappedRange()).set(m),n.unmap();const c={width:o.clientWidth*devicePixelRatio,height:o.clientHeight*devicePixelRatio},u=e.createTexture({size:c,format:"depth24plus",usage:GPUTextureUsage.RENDER_ATTACHMENT}),P=4*16,p=e.createBuffer({size:P,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),x=e.createBindGroup({layout:r.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:p}}]}),d={colorAttachments:[{view:t.getCurrentTexture().createView(),loadOp:"clear",clearValue:{r:.2,g:.3,b:.3,a:1},storeOp:"store"}],depthStencilAttachment:{view:u.createView(),depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"store"}},b=o.width/o.height,l=f();B(l,2*Math.PI/5,b,1,1e3);function v(){const i=f();C(i,i,h(0,0,-6));const s=Date.now()/1e3;E(i,i,1,h(Math.sin(s),Math.cos(s),0));const a=f();return R(a,l,i),a}function g(){const i=v();e.queue.writeBuffer(p,0,i.buffer,i.byteOffset,i.byteLength),d.colorAttachments[0].view=t.getCurrentTexture().createView();const s=e.createCommandEncoder(),a=s.beginRenderPass(d);a.setPipeline(r),a.setBindGroup(0,x),a.setVertexBuffer(0,n),a.draw(A,1,0,0),a.end();const V=s.finish();e.queue.submit([V]),requestAnimationFrame(g)}requestAnimationFrame(g)}async function q(){const e=document.querySelector("canvas");if(!e)throw new Error("No Canvas");const{device:t,context:r,format:o}=await T(e),n=await G(t,o);w(t,r,n,e),window.addEventListener("resize",()=>{e.width=e.clientWidth*devicePixelRatio,e.height=e.clientHeight*devicePixelRatio,r.configure({device:t,format:o,alphaMode:"opaque"}),w(t,r,n,e)})}q();
