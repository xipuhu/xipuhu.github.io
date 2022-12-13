import"./modulepreload-polyfill.c7c6310f.js";import{v as w,i as P,a as b,b as v,g as U,c as C,d as V,e as M}from"./math.b4722385.js";import"./vec3.f14a70f7.js";var R=`@group(0) @binding(0) var<storage> modelViews : array<mat4x4<f32>>;
@group(0) @binding(1) var<uniform> projection : mat4x4<f32>;
@group(0) @binding(2) var<storage> colors : array<vec4<f32>>;

struct VertexOutput {
    @builtin(position) Position : vec4<f32>,
    @location(0) fragPosition : vec3<f32>,
    @location(1) fragNormal : vec3<f32>,
    @location(2) fragUV : vec2<f32>,
    @location(3) fragColor : vec4<f32>
}

@vertex
fn main(
    @builtin(instance_index) index : u32,
    @location(0) position : vec3<f32>,
    @location(1) normal : vec3<f32>,
    @location(2) uv : vec2<f32>
) -> VertexOutput {
    let modelView = modelViews[index];
    let mvp = projection * modelView;
    let pos = vec4<f32>(position, 1.0);

    var output : VertexOutput;
    output.Position = mvp * pos;
    output.fragPosition = (modelView * pos).xyz;
    output.fragNormal = (modelView * vec4<f32>(normal, 0.0)).xyz;
    output.fragUV = uv;
    output.fragColor = colors[index];

    return output;
}
`,z=`
@group(1) @binding(0) var<uniform> ambientIntensity: f32;
@group(1) @binding(1) var<uniform> pointLight: array<vec4<f32>, 2>;

@fragment
fn main(
    @location(0) fragPosition : vec3<f32>,
    @location(1) fragNormal : vec3<f32>,
    @location(2) fragUV : vec2<f32>,
    @location(3) fragColor : vec4<f32>
) -> @location(0) vec4<f32> {
    let objectColor = fragColor.rgb;

    // \u5224\u65ADobj\u662F\u5426\u4E3A\u70B9\u5149\u6E90\u4F4D\u7F6E\u5904\u7684obj
    if (objectColor.r == 1.0 && objectColor.g == 1.0 && objectColor.b == 1.0) {
        return vec4(objectColor, 1.0);
    }

    let ambientLightColor = vec3(1.0, 1.0, 1.0);
    let pointLightColor = vec3(1.0, 1.0, 1.0);

    var lightResult = vec3(0.0, 0.0, 0.0);
    // ambient
    lightResult += ambientLightColor * ambientIntensity;
    // Point Light
    var pointLightPosition = pointLight[0].xyz;
    var pointLightIntensity: f32 = pointLight[1][0];
    var pointLightRadius: f32 = pointLight[1][1];
    var L = pointLightPosition - fragPosition;
    var distance = length(L);
    if (distance < pointLightRadius) {
        var diffuse: f32 = max(dot(normalize(L), fragNormal), 0.0);
        var distanceFactor: f32 = pow(1.0 - distance / pointLightRadius, 2.0);
        lightResult += pointLightColor * pointLightIntensity * diffuse * distanceFactor;
    }

    return vec4<f32>(objectColor * lightResult, 1.0);
}`;const c=500;async function S(e){if(!navigator.gpu)throw new Error("Not Support WebGPU");const r=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!r)throw new Error("No Adapter Found");const f=await r.requestDevice(),t=e.getContext("webgpu"),u=navigator.gpu.getPreferredCanvasFormat(),a=window.devicePixelRatio||1,o={width:e.clientWidth*a,height:e.clientHeight*a};return e.width=o.width,e.height=o.height,t.configure({device:f,format:u,alphaMode:"opaque"}),{device:f,context:t,format:u,presentationSize:o}}async function T(e,r){const f={vertex:{module:e.createShaderModule({code:R}),entryPoint:"main",buffers:[{arrayStride:32,attributes:[{shaderLocation:0,offset:0,format:"float32x3"},{shaderLocation:1,offset:12,format:"float32x3"},{shaderLocation:2,offset:24,format:"float32x2"}]}]},fragment:{module:e.createShaderModule({code:z}),entryPoint:"main",targets:[{format:r}]},primitive:{topology:"triangle-list",cullMode:"back"},depthStencil:{depthWriteEnabled:!0,depthCompare:"less",format:"depth24plus"},layout:"auto"};return await e.createRenderPipelineAsync(f)}async function E(e,r,f){const t={width:f.clientWidth*devicePixelRatio,height:f.clientHeight*devicePixelRatio},u=e.createTexture({size:t,format:"depth24plus",usage:GPUTextureUsage.RENDER_ATTACHMENT}),a={vertex:e.createBuffer({label:"GPUBuffer store vertex",size:w.byteLength,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST}),index:e.createBuffer({label:"GPUBuffer store vertex index",size:P.byteLength,usage:GPUBufferUsage.INDEX|GPUBufferUsage.COPY_DST})},o={vertex:e.createBuffer({label:"GPUBuffer store vertex",size:b.byteLength,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST}),index:e.createBuffer({label:"GPUBuffer store vertex index",size:v.byteLength,usage:GPUBufferUsage.INDEX|GPUBufferUsage.COPY_DST})};e.queue.writeBuffer(a.vertex,0,w),e.queue.writeBuffer(a.index,0,P),e.queue.writeBuffer(o.vertex,0,b),e.queue.writeBuffer(o.index,0,v);const l=e.createBuffer({label:"GPUBuffer sotre n*4x4 matrix",size:4*4*4*c,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),n=e.createBuffer({label:"GPUBuffer sotre 4x4 matrix",size:4*4*4,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),g=e.createBuffer({label:"GPUBuffer sotre n*4 color",size:4*4*c,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),h=e.createBindGroup({label:"Uniform Group with matrix",layout:r.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:l}},{binding:1,resource:{buffer:n}},{binding:2,resource:{buffer:g}}]}),d=e.createBuffer({label:"ambientBuffer store ambient intensity",size:1*4,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),i=e.createBuffer({label:"pointLightBuffer store point light data",size:8*4,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),p=e.createBindGroup({label:"uniform group for light buffer",layout:r.getBindGroupLayout(1),entries:[{binding:0,resource:{buffer:d}},{binding:1,resource:{buffer:i}}]});return{depthTexture:u,boxBuffer:a,sphereBuffer:o,modelViewBuffer:l,projectionBuffer:n,colorBuffer:g,vsGroup:h,ambientBuffer:d,pointLightBuffer:i,lightGroup:p}}function y(e,r,f,t){var h,d;const u={colorAttachments:[{view:r.getCurrentTexture().createView(),loadOp:"clear",clearValue:{r:.2,g:.3,b:.3,a:1},storeOp:"store"}],depthStencilAttachment:{view:t.depthTexture.createView(),depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"store"}},a=new Float32Array(c*4*4),o=new Float32Array(c*4);for(let i=0;i<c;++i){const p={x:Math.random()*40-20,y:Math.random()*40-20,z:-50-Math.random()*50},x={x:Math.random(),y:Math.random(),z:Math.random()},m=U(p,x,{x:1,y:1,z:1});a.set(m,i*4*4),o.set([Math.random(),Math.random(),Math.random(),1],i*4)}const l=new Float32Array([.1]),n=new Float32Array(8);n[2]=-50,n[4]=1,n[5]=40;function g(){const i=performance.now();n[0]=10*Math.sin(i/1e3),n[1]=10*Math.cos(i/1e3),n[2]=-60+10*Math.cos(i/1e3),e.queue.writeBuffer(t.ambientBuffer,0,l),e.queue.writeBuffer(t.pointLightBuffer,0,n);const p={x:n[0],y:n[1],z:n[2]},m=U(p,{x:1,y:1,z:1},{x:.5,y:.5,z:.5});a.set(m,(c-1)*4*4),o.set([1,1,1,1],(c-1)*4),e.queue.writeBuffer(t.colorBuffer,0,o),e.queue.writeBuffer(t.modelViewBuffer,0,a),u.colorAttachments[0].view=r.getCurrentTexture().createView();const B=e.createCommandEncoder(),s=B.beginRenderPass(u);s.setPipeline(f),s.setBindGroup(0,t.vsGroup),s.setBindGroup(1,t.lightGroup),s.setVertexBuffer(0,t.boxBuffer.vertex),s.setIndexBuffer(t.boxBuffer.index,"uint16"),s.drawIndexed(V,c/2,0,0,0),s.setVertexBuffer(0,t.sphereBuffer.vertex),s.setIndexBuffer(t.sphereBuffer.index,"uint16"),s.drawIndexed(M,c/2,0,0,c/2),s.end();const L=B.finish();e.queue.submit([L]),requestAnimationFrame(g)}requestAnimationFrame(g),(h=document.querySelector("#ambientIntensity"))==null||h.addEventListener("input",i=>{l[0]=+i.target.value}),(d=document.querySelector("#pointLightRadius"))==null||d.addEventListener("input",i=>{n[5]=+i.target.value})}async function q(){const e=document.querySelector("canvas");if(!e)throw new Error("No Canvas");const{device:r,context:f,format:t,presentationSize:u}=await S(e),a=await T(r,t),o=await E(r,a,e);y(r,f,a,o);function l(){const n=u.width/u.height,g=C(n);r.queue.writeBuffer(o.projectionBuffer,0,g)}l(),window.addEventListener("resize",()=>{e.width=e.clientWidth*devicePixelRatio,e.height=e.clientHeight*devicePixelRatio,f.configure({device:r,format:t,alphaMode:"opaque"}),y(r,f,a,o),l()})}q();
