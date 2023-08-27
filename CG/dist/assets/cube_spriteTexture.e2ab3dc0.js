import"./modulepreload-polyfill.b7f2da20.js";import{c as b,a as B,b as T,d as x,e as w,p as V,f as y,t as G,g as v,r as S,m as M}from"./vec3.aa6065a3.js";const E=`struct Uniforms {
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
`,R=`@group(1) @binding(0) var Sampler: sampler;
@group(1) @binding(1) var Texture: texture_2d<f32>;
@group(1) @binding(2) var<uniform> uvOffset : vec4<f32>;

@fragment
fn main(
  @location(0) fragUV: vec2<f32>,
  @location(1) fragPosition: vec4<f32>
) -> @location(0) vec4<f32> {
    var uv = fragUV * vec2<f32>(uvOffset[2], uvOffset[3]) + vec2<f32>(uvOffset[0], uvOffset[1]);
    return textureSample(Texture, Sampler, uv) * fragPosition;
}`,O="../assets/sprites.13e4f10f.webp";async function C(e){if(!navigator.gpu)throw new Error("Not Support WebGPU");const r=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!r)throw new Error("No Adapter Found");const n=await r.requestDevice(),i=e.getContext("webgpu"),t=navigator.gpu.getPreferredCanvasFormat(),u=window.devicePixelRatio||1,c={width:e.clientWidth*u,height:e.clientHeight*u};return e.width=c.width,e.height=c.height,i.configure({device:n,format:t,alphaMode:"opaque"}),{device:n,context:i,format:t,presentationSize:c}}async function A(e,r){const n={vertex:{module:e.createShaderModule({code:E}),entryPoint:"main",buffers:[{arrayStride:b,attributes:[{shaderLocation:0,offset:B,format:"float32x4"},{shaderLocation:1,offset:T,format:"float32x2"}]}]},fragment:{module:e.createShaderModule({code:R}),entryPoint:"main",targets:[{format:r}]},primitive:{topology:"triangle-list",cullMode:"back"},depthStencil:{depthWriteEnabled:!0,depthCompare:"less",format:"depth24plus"},layout:"auto"};return await e.createRenderPipelineAsync(n)}async function q(e,r,n){const i=e.createBuffer({size:x.byteLength,usage:GPUBufferUsage.VERTEX,mappedAtCreation:!0});new Float32Array(i.getMappedRange()).set(x),i.unmap();const t={width:n.clientWidth*devicePixelRatio,height:n.clientHeight*devicePixelRatio},u=e.createTexture({size:t,format:"depth24plus",usage:GPUTextureUsage.RENDER_ATTACHMENT}),c=4*16,p=e.createBuffer({size:c,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),d=e.createBindGroup({layout:r.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:p}}]}),g=await(await fetch(O)).blob(),o=await createImageBitmap(g),s=[o.width,o.height],a=e.createTexture({size:s,format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT});e.queue.copyExternalImageToTexture({source:o},{texture:a},s);const m=e.createSampler({magFilter:"linear",minFilter:"linear"}),f=new Float32Array([0,0,1/3,1/2]),h=e.createBuffer({label:"GPUBuffer store UV offset",size:4*4,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});e.queue.writeBuffer(h,0,f);const U=e.createBindGroup({label:"Texture Group with Texture & Sampler",layout:r.getBindGroupLayout(1),entries:[{binding:0,resource:m},{binding:1,resource:a.createView()},{binding:2,resource:{buffer:h}}]});return{verticesBuffer:i,depthTexture:u,uniformBuffer:p,uniformGroup:d,textureGroup:U,uvBuffer:h,uvOffset:f}}async function P(e,r,n,i,t){const u={colorAttachments:[{view:r.getCurrentTexture().createView(),loadOp:"clear",clearValue:{r:.2,g:.3,b:.3,a:1},storeOp:"store"}],depthStencilAttachment:{view:t.depthTexture.createView(),depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"store"}},c=i.width/i.height,p=w();V(p,2*Math.PI/5,c,1,1e3);function d(){const o=w();G(o,o,v(0,0,-6));const s=Date.now()/1e3;S(o,o,1,v(Math.sin(s),Math.cos(s),0));const a=w();return M(a,p,o),a}let l=0;function g(){if(++l,l%30===0){let f=t.uvOffset[0];t.uvOffset[0]=f>=2/3?0:f+1/3,l%90===0&&(f=t.uvOffset[1],t.uvOffset[1]=f>=1/2?0:f+1/2),e.queue.writeBuffer(t.uvBuffer,0,t.uvOffset)}const o=d();e.queue.writeBuffer(t.uniformBuffer,0,o.buffer,o.byteOffset,o.byteLength),u.colorAttachments[0].view=r.getCurrentTexture().createView();const s=e.createCommandEncoder(),a=s.beginRenderPass(u);a.setPipeline(n),a.setBindGroup(0,t.uniformGroup),a.setBindGroup(1,t.textureGroup),a.setVertexBuffer(0,t.verticesBuffer),a.draw(y,1,0,0),a.end();const m=s.finish();e.queue.submit([m]),requestAnimationFrame(g)}g()}async function z(){const e=document.querySelector("canvas");if(!e)throw new Error("No Canvas");const{device:r,context:n,format:i}=await C(e),t=await A(r,i),u=await q(r,t,e);P(r,n,t,e,u),window.addEventListener("resize",()=>{e.width=e.clientWidth*devicePixelRatio,e.height=e.clientHeight*devicePixelRatio,n.configure({device:r,format:i,alphaMode:"opaque"}),P(r,n,t,e,u)})}z();
