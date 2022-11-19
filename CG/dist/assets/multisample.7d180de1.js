import"./modulepreload-polyfill.c7c6310f.js";const g=`@vertex
fn main(@builtin(vertex_index) VertexIndex : u32) -> @builtin(position) vec4<f32> {
    var pos = array<vec2<f32>, 3>(
	    vec2<f32>(0.0, 0.5),
	    vec2<f32>(-0.5, -0.5),
	    vec2<f32>(0.5, -0.5)
    );
    return vec4<f32>(pos[VertexIndex], 0.0, 1.0);
}`,l=`@fragment
fn main() -> @location(0) vec4<f32> {
    return vec4<f32>(1.0, 0.0, 0.0, 1.0);
}`;async function p(e){if(!navigator.gpu)throw new Error("Not Support WebGpu");const t=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!t)throw new Error("No Adapter Found");const r=await t.requestDevice(),n=e.getContext("webgpu"),i=navigator.gpu.getPreferredCanvasFormat(),o=window.devicePixelRatio||1,a={width:e.clientWidth*o,height:e.clientHeight*o};return e.width=a.width,e.height=a.height,n.configure({device:r,format:i,alphaMode:"opaque"}),{device:r,context:n,format:i,size:a}}async function h(e,t){const r={vertex:{module:e.createShaderModule({code:g}),entryPoint:"main"},fragment:{module:e.createShaderModule({code:l}),entryPoint:"main",targets:[{format:t}]},primitive:{topology:"triangle-list"},multisample:{count:4},layout:"auto"};return await e.createRenderPipelineAsync(r)}function u(e,t,r){const n=e.createCommandEncoder(),i=t.getCurrentTexture(),o={width:i.width,height:i.height},s={colorAttachments:[{view:e.createTexture({size:o,sampleCount:4,format:navigator.gpu.getPreferredCanvasFormat(),usage:GPUTextureUsage.RENDER_ATTACHMENT}).createView(),resolveTarget:t.getCurrentTexture().createView(),loadOp:"clear",clearValue:{r:.2,g:.3,b:.3,a:1},storeOp:"store"}]},c=n.beginRenderPass(s);c.setPipeline(r),c.draw(3),c.end();const d=n.finish();e.queue.submit([d])}async function f(){const e=document.querySelector("canvas");if(!e)throw new Error("No Canvas");const{device:t,context:r,format:n}=await p(e),i=await h(t,n);u(t,r,i),window.addEventListener("resize",()=>{e.width=e.clientWidth*devicePixelRatio,e.width=e.clientHeight*devicePixelRatio,r.configure({device:t,format:n,alphaMode:"opaque"}),u(t,r,i)})}f();
