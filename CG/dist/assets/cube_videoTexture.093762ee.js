import"./modulepreload-polyfill.c7c6310f.js";import{c as y,a as V,b as B,d as x,e as m,p as U,f as M,t as S,g as w,r as T,m as E}from"./vec3.aa6065a3.js";var G=`struct Uniforms {
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
`,C=`@group(1) @binding(0) var Sampler: sampler;
@group(1) @binding(1) var Texture: texture_external;

@fragment
fn main(@location(0) fragUV: vec2<f32>,
        @location(1) fragPosition: vec4<f32>) -> @location(0) vec4<f32> {
  return textureSampleBaseClampToEdge(Texture, Sampler, fragUV);
}`,R="/assets/video.3bb938fb.mp4";async function A(e){if(!navigator.gpu)throw new Error("Not Support WebGPU");const t=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!t)throw new Error("No Adapter Found");const r=await t.requestDevice(),o=e.getContext("webgpu"),n=navigator.gpu.getPreferredCanvasFormat(),i=window.devicePixelRatio||1,u={width:e.clientWidth*i,height:e.clientHeight*i};return e.width=u.width,e.height=u.height,o.configure({device:r,format:n,alphaMode:"opaque"}),{device:r,context:o,format:n,presentationSize:u}}async function O(e,t){const r={vertex:{module:e.createShaderModule({code:G}),entryPoint:"main",buffers:[{arrayStride:y,attributes:[{shaderLocation:0,offset:V,format:"float32x4"},{shaderLocation:1,offset:B,format:"float32x2"}]}]},fragment:{module:e.createShaderModule({code:C}),entryPoint:"main",targets:[{format:t}]},primitive:{topology:"triangle-list",cullMode:"back"},depthStencil:{depthWriteEnabled:!0,depthCompare:"less",format:"depth24plus"},layout:"auto"};return await e.createRenderPipelineAsync(r)}async function q(e,t,r){const o=e.createBuffer({size:x.byteLength,usage:GPUBufferUsage.VERTEX,mappedAtCreation:!0});new Float32Array(o.getMappedRange()).set(x),o.unmap();const n={width:r.clientWidth*devicePixelRatio,height:r.clientHeight*devicePixelRatio},i=e.createTexture({size:n,format:"depth24plus",usage:GPUTextureUsage.RENDER_ATTACHMENT}),u=4*16,f=e.createBuffer({size:u,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),l=e.createBindGroup({layout:t.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:f}}]});return{verticesBuffer:o,depthTexture:i,uniformBuffer:f,uniformGroup:l}}async function v(e,t,r,o,n){const i={colorAttachments:[{view:t.getCurrentTexture().createView(),loadOp:"clear",clearValue:{r:.2,g:.3,b:.3,a:1},storeOp:"store"}],depthStencilAttachment:{view:n.depthTexture.createView(),depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"store"}},u=o.width/o.height,f=m();U(f,2*Math.PI/5,u,1,1e3);function l(){const a=m();S(a,a,w(0,0,-6));const p=Date.now()/1e3;T(a,a,1,w(Math.sin(p),Math.cos(p),0));const d=m();return E(d,f,a),d}const s=document.createElement("video");s.loop=!0,s.autoplay=!0,s.muted=!0,s.src=R,await s.play();const P=e.createSampler({magFilter:"linear",minFilter:"linear"});function g(){const a=l();e.queue.writeBuffer(n.uniformBuffer,0,a.buffer,a.byteOffset,a.byteLength),i.colorAttachments[0].view=t.getCurrentTexture().createView();const p=e.importExternalTexture({source:s}),d=e.createBindGroup({layout:r.getBindGroupLayout(1),entries:[{binding:0,resource:P},{binding:1,resource:p}]}),h=e.createCommandEncoder(),c=h.beginRenderPass(i);c.setPipeline(r),c.setBindGroup(0,n.uniformGroup),c.setBindGroup(1,d),c.setVertexBuffer(0,n.verticesBuffer),c.draw(M,1,0,0),c.end();const b=h.finish();e.queue.submit([b]),requestAnimationFrame(g)}g()}async function z(){const e=document.querySelector("canvas");if(!e)throw new Error("No Canvas");const{device:t,context:r,format:o}=await A(e),n=await O(t,o),i=await q(t,n,e);v(t,r,n,e,i),window.addEventListener("resize",()=>{e.width=e.clientWidth*devicePixelRatio,e.height=e.clientHeight*devicePixelRatio,r.configure({device:t,format:o,alphaMode:"opaque"}),v(t,r,n,e,i)})}z();
