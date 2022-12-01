import"./modulepreload-polyfill.b7f2da20.js";var s=`@vertex
fn main(@builtin(vertex_index) VertexIndex : u32) -> @builtin(position) vec4<f32> {
    var pos = array<vec2<f32>, 3>(
	    vec2<f32>(0.0, 0.5),
	    vec2<f32>(-0.5, -0.5),
	    vec2<f32>(0.5, -0.5)
    );
    return vec4<f32>(pos[VertexIndex], 0.0, 1.0);
}`,u=`@fragment
fn main() -> @location(0) vec4<f32> {
    return vec4<f32>(1.0, 0.0, 0.0, 1.0);
}`;async function l(e){if(!navigator.gpu)throw new Error("Not Support WebGPU");const t=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!t)throw new Error("No Adapter Found");const n=await t.requestDevice(),r=e.getContext("webgpu"),o=navigator.gpu.getPreferredCanvasFormat(),a=window.devicePixelRatio||1,i={width:e.clientWidth*a,height:e.clientHeight*a};return e.width=i.width,e.height=i.height,r.configure({device:n,format:o,alphaMode:"opaque"}),{device:n,context:r,format:o,size:i}}async function p(e,t){const n={vertex:{module:e.createShaderModule({code:s}),entryPoint:"main"},fragment:{module:e.createShaderModule({code:u}),entryPoint:"main",targets:[{format:t}]},primitive:{topology:"triangle-list"},layout:"auto"};return await e.createRenderPipelineAsync(n)}function c(e,t,n){const r=e.createCommandEncoder(),a={colorAttachments:[{view:t.getCurrentTexture().createView(),loadOp:"clear",clearValue:{r:.2,g:.3,b:.3,a:1},storeOp:"store"}]},i=r.beginRenderPass(a);i.setPipeline(n),i.draw(3),i.end();const d=r.finish();e.queue.submit([d])}async function f(){const e=document.querySelector("canvas");if(!e)throw new Error("No Canvas");const{device:t,context:n,format:r}=await l(e),o=await p(t,r);c(t,n,o),window.addEventListener("resize",()=>{e.width=e.clientWidth*devicePixelRatio,e.height=e.clientHeight*devicePixelRatio,n.configure({device:t,format:r,alphaMode:"opaque"}),c(t,n,o)})}f();
