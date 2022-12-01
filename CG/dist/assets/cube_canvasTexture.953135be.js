import"./modulepreload-polyfill.b7f2da20.js";import{c as P,a as v,b as T,d as h,e as m,p as b,f as y,t as U,g as x,r as E,m as V}from"./vec3.aa6065a3.js";var S=`struct Uniforms {
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
`,G=`@group(1) @binding(0) var Sampler: sampler;
@group(1) @binding(1) var Texture: texture_2d<f32>;

@fragment
fn main(@location(0) fragUV: vec2<f32>,
        @location(1) fragPosition: vec4<f32>) -> @location(0) vec4<f32> {
  return textureSample(Texture, Sampler, fragUV) * fragPosition;
}`;async function B(e){if(!navigator.gpu)throw new Error("Not Support WebGPU");const t=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!t)throw new Error("No Adapter Found");const n=await t.requestDevice(),c=e.getContext("webgpu"),u=navigator.gpu.getPreferredCanvasFormat(),o=window.devicePixelRatio||1,f={width:e.clientWidth*o,height:e.clientHeight*o};return e.width=f.width,e.height=f.height,c.configure({device:n,format:u,alphaMode:"opaque"}),{device:n,context:c,format:u,presentationSize:f}}async function M(e,t){const n={vertex:{module:e.createShaderModule({code:S}),entryPoint:"main",buffers:[{arrayStride:P,attributes:[{shaderLocation:0,offset:v,format:"float32x4"},{shaderLocation:1,offset:T,format:"float32x2"}]}]},fragment:{module:e.createShaderModule({code:G}),entryPoint:"main",targets:[{format:t}]},primitive:{topology:"triangle-list",cullMode:"back"},depthStencil:{depthWriteEnabled:!0,depthCompare:"less",format:"depth24plus"},layout:"auto"};return await e.createRenderPipelineAsync(n)}async function R(e,t,n,c){const u=e.createBuffer({size:h.byteLength,usage:GPUBufferUsage.VERTEX,mappedAtCreation:!0});new Float32Array(u.getMappedRange()).set(h),u.unmap();const o={width:n.clientWidth*devicePixelRatio,height:n.clientHeight*devicePixelRatio},f=e.createTexture({size:o,format:"depth24plus",usage:GPUTextureUsage.RENDER_ATTACHMENT}),i=4*16,p=e.createBuffer({size:i,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),d=e.createBindGroup({layout:t.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:p}}]}),l=[c.width,c.height],r=e.createTexture({size:l,format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT}),s=e.createSampler({magFilter:"linear",minFilter:"linear"}),a=e.createBindGroup({label:"Texture Group with Texture & Sampler",layout:t.getBindGroupLayout(1),entries:[{binding:0,resource:s},{binding:1,resource:r.createView()}]});return{verticesBuffer:u,depthTexture:f,uniformBuffer:p,uniformGroup:d,textureGroup:a,cavasTexture:r}}async function w(e,t,n,c,u,o){const f={colorAttachments:[{view:t.getCurrentTexture().createView(),loadOp:"clear",clearValue:{r:.2,g:.3,b:.3,a:1},storeOp:"store"}],depthStencilAttachment:{view:o.depthTexture.createView(),depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"store"}},i=c.width/c.height,p=m();b(p,2*Math.PI/5,i,1,1e3);function d(){const r=m();U(r,r,x(0,0,-6));const s=Date.now()/1e3;E(r,r,1,x(Math.sin(s),Math.cos(s),0));const a=m();return V(a,p,r),a}function l(){const r=d();e.queue.writeBuffer(o.uniformBuffer,0,r.buffer,r.byteOffset,r.byteLength),e.queue.copyExternalImageToTexture({source:u},{texture:o.cavasTexture},[u.width,u.height]),f.colorAttachments[0].view=t.getCurrentTexture().createView();const s=e.createCommandEncoder(),a=s.beginRenderPass(f);a.setPipeline(n),a.setBindGroup(0,o.uniformGroup),a.setBindGroup(1,o.textureGroup),a.setVertexBuffer(0,o.verticesBuffer),a.draw(y,1,0,0),a.end();const g=s.finish();e.queue.submit([g]),requestAnimationFrame(l)}l()}async function C(){const e=document.querySelector("canvas#webgpu"),t=document.querySelector("canvas#canvas");if(!e||!t)throw new Error("No Canvas");{const i=t.getContext("2d");if(!i)throw new Error("No support 2d");i.fillStyle="#fff",i.lineWidth=5,i.lineCap="round",i.lineJoin="round",i.fillRect(0,0,t.width,t.height);let p=!1,d=0,l=0,r=0;t.addEventListener("pointerdown",s=>{p=!0,d=s.offsetX,l=s.offsetY}),t.addEventListener("pointermove",s=>{if(!p)return;const a=s.offsetX,g=s.offsetY;r=r>360?0:r+1,i.strokeStyle=`hsl(${r}, 90%, 50%)`,i.beginPath(),i.moveTo(d,l),i.lineTo(a,g),i.stroke(),d=a,l=g}),t.addEventListener("pointerup",()=>p=!1),t.addEventListener("pointerout",()=>p=!1)}const{device:n,context:c,format:u}=await B(e),o=await M(n,u),f=await R(n,o,e,t);w(n,c,o,e,t,f),window.addEventListener("resize",()=>{e.width=e.clientWidth*devicePixelRatio,e.height=e.clientHeight*devicePixelRatio,c.configure({device:n,format:u,alphaMode:"opaque"}),w(n,c,o,e,t,f)})}C();
