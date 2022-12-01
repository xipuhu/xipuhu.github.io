import"./modulepreload-polyfill.b7f2da20.js";var p=`@vertex
fn main(@builtin(vertex_index) VertexIndex : u32) -> @builtin(position) vec4<f32> {
    var pos = array<vec2<f32>, 3>(
	    vec2<f32>(0.0, 0.5),
	    vec2<f32>(-0.5, -0.5),
	    vec2<f32>(0.5, -0.5)
    );
    return vec4<f32>(pos[VertexIndex], 0.0, 1.0);
}`,d=`@group(0) @binding(0) var<uniform> color : vec4<f32>;
@fragment
fn main() -> @location(0) vec4<f32> {
    return color;
}`;async function g(e){if(!navigator.gpu)throw new Error("Not Support WebGPU");const r=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!r)throw new Error("No Adapter Found");const n=await r.requestDevice(),o=e.getContext("webgpu"),t=navigator.gpu.getPreferredCanvasFormat(),i=window.devicePixelRatio||1,c={width:e.clientWidth*i,height:e.clientHeight*i};return e.width=c.width,e.height=c.height,o.configure({device:n,format:t,alphaMode:"opaque"}),{device:n,context:o,format:t,size:c}}async function w(e,r){const n={vertex:{module:e.createShaderModule({code:p}),entryPoint:"main"},fragment:{module:e.createShaderModule({code:d}),entryPoint:"main",targets:[{format:r}]},primitive:{topology:"triangle-list"},layout:"auto"},o=await e.createRenderPipelineAsync(n),t=e.createBuffer({label:"GPUBuffer store rgba color",size:4*4,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});e.queue.writeBuffer(t,0,new Float32Array([0,0,1,1]));const i=e.createBindGroup({label:"uniform group with colorBuffer",layout:o.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:t}}]});return{pipeline:o,colorBuffer:t,uniformGroup:i}}function s(e,r,n,o){const t=e.createCommandEncoder(),c={colorAttachments:[{view:r.getCurrentTexture().createView(),loadOp:"clear",clearValue:{r:.2,g:.3,b:.3,a:1},storeOp:"store"}]},a=t.beginRenderPass(c);a.setPipeline(n),a.setBindGroup(0,o),a.draw(3),a.end();const u=t.finish();e.queue.submit([u])}async function m(){var i;const e=document.querySelector("canvas");if(!e)throw new Error("No Canvas");const{device:r,context:n,format:o}=await g(e),t=await w(r,o);s(r,n,t.pipeline,t.uniformGroup),(i=document.querySelector('input[type="color"]'))==null||i.addEventListener("input",c=>{const a=c.target.value,u=+("0x"+a.slice(1,3))/255,l=+("0x"+a.slice(3,5))/255,f=+("0x"+a.slice(5,7))/255;r.queue.writeBuffer(t.colorBuffer,0,new Float32Array([u,l,f,1])),s(r,n,t.pipeline,t.uniformGroup)}),window.addEventListener("resize",()=>{e.width=e.clientWidth*devicePixelRatio,e.height=e.clientHeight*devicePixelRatio,n.configure({device:r,format:o,alphaMode:"opaque"}),s(r,n,t.pipeline,t.uniformGroup)})}m();
