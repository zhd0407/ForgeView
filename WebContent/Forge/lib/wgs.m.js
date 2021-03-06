/**
 * Created by Administrator on 2018/6/8.
 */
/*!
 * @license
 * Copyright 2016 Autodesk, Inc.
 * All rights reserved.
 * 
 * This computer source code and related instructions and comments are the
 * unpublished confidential and proprietary information of Autodesk, Inc.
 * and are protected under Federal copyright and state trade secret law.
 * They may not be disclosed to, copied or used by any third party without
 * the prior written consent of Autodesk, Inc.
 */
var WGS = function(a) {
    function b(d) {
        if (c[d]) return c[d].exports;
        var e = c[d] = {
            exports: {},
            id: d,
            loaded: !1
        };
        return a[d].call(e.exports, e, e.exports, b),
            e.loaded = !0,
            e.exports
    }
    var c = {};
    return b.m = a,
        b.c = c,
        b.p = "",
        b(0)
} ([function(a, b, c) {
    "use strict";
    var d = function(a, b) {
        for (var c in b) b.hasOwnProperty(c) && (a[c] = b[c])
    };
    a.exports = {
        VERSION: "0.0.0",
        BackgroundShader: c(1),
        BasicShader: c(4),
        BlendShader: c(35),
        CelShader: c(38),
        CopyShader: c(41),
        FXAAShader: c(44),
        SAOBlurShader: c(47),
        SAOShader: c(50),
        NormalsShader: c(53),
        EdgeShader: c(56),
        LineShader: c(59),
        OcclusionShader: c(62),
        ShaderPass: c(65),
        GaussianPass: c(67),
        GroundReflection: c(70),
        WebGLShader: c(74),
        PhongShader: c(75),
        VertexEnumerator: c(78),
        DeriveTopology: c(79),
        VBIntersector: c(80),
        GeometryList: c(81),
        RenderBatch: c(82),
        InstanceBufferBuilder: c(84),
        WebGLRenderer: c(94),
        ModelIteratorLinear: c(110),
        FragmentListConsolidation: c(112),
        ConsolidationIterator: c(113),
        ModelIteratorBVH: c(114),
        BufferGeometry: c(86),
        Consolidation: c(85),
        RenderScene: c(115),
        SortedList: c(116),
        RenderModel: c(117),
        MaterialConverter: c(121),
        MaterialManager: c(89)
    },
        d(a.exports, c(71)),
        d(a.exports, c(5)),
        d(a.exports, c(122)),
        d(a.exports, c(90)),
        d(a.exports, c(127)),
        d(a.exports, c(66)),
        d(a.exports, c(97)),
        d(a.exports, c(95)),
        d(a.exports, c(91)),
        d(a.exports, c(96)),
        d(a.exports, c(83)),
        d(a.exports, c(118)),
        d(a.exports, c(120)),
        d(a.exports, c(119)),
        d(a.exports, c(128)),
        d(a.exports, c(129)),
        d(a.exports, c(130)),
        d(a.exports, c(131))
},
    function(a, b, c) {
        "use strict";
        var d = {
            uniforms: {
                color1: {
                    type: "v3",
                    value: new THREE.Vector3(41 / 255, 76 / 255, 120 / 255)
                },
                color2: {
                    type: "v3",
                    value: new THREE.Vector3(1 / 255, 2 / 255, 3 / 255)
                },
                envMap: {
                    type: "t",
                    value: null
                },
                envRotationSin: {
                    type: "f",
                    value: 0
                },
                envRotationCos: {
                    type: "f",
                    value: 1
                },
                exposureBias: {
                    type: "f",
                    value: 1
                },
                envMapExposure: {
                    type: "f",
                    value: 1
                },
                uCamDir: {
                    type: "v3",
                    value: new THREE.Vector3
                },
                uCamUp: {
                    type: "v3",
                    value: new THREE.Vector3
                },
                uResolution: {
                    type: "v2",
                    value: new THREE.Vector2(600, 400)
                },
                uHalfFovTan: {
                    type: "f",
                    value: .5
                },
                envMapBackground: {
                    type: "i",
                    value: 0
                }
            },
            vertexShader: c(2),
            fragmentShader: c(3)
        };
        a.exports = d
    },
    function(a, b) {
        a.exports = "uniform vec3 color1;\r\nuniform vec3 color2;\r\n\r\nvarying vec2 vUv;\r\nvarying vec3 vColor;\r\n\r\nvoid main() {\r\n\r\n    if (uv.y == 0.0)\r\n        vColor = color2;\r\n    else\r\n        vColor = color1;\r\n\r\n    vUv = uv;\r\n\r\n    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\r\n\r\n}\r\n"
    },
    function(a, b) {
        a.exports = "varying vec3 vColor;\r\nvarying vec2 vUv;\r\n\r\n\r\nuniform samplerCube envMap;\r\nuniform vec3 uCamDir;\r\nuniform vec3 uCamUp;\r\nuniform vec2 uResolution;\r\nuniform float uHalfFovTan;\r\nuniform bool envMapBackground;\r\n\r\n#include<env_sample>\r\n\r\nconst int bloomRange = 4;\r\n\r\n#include<ordered_dither>\r\n\r\nuniform float envMapExposure;\r\n#if TONEMAP_OUTPUT > 0\r\nuniform float exposureBias;\r\n#include<tonemap>\r\n#endif\r\n\r\nvec3 rayDir(in vec2 vUv) {\r\n    vec3 A = (uResolution.x/uResolution.y)*normalize(cross(uCamDir,uCamUp)) * (uHalfFovTan * 2.0);\r\n    vec3 B = normalize(uCamUp) * (uHalfFovTan * 2.0);\r\n    vec3 C = normalize(uCamDir);\r\n\r\n    vec3 ray = normalize( C + (2.0*vUv.x-1.0)*A + (2.0*vUv.y-1.0)*B );\r\n    return ray;\r\n}\r\n\r\nvec3 getColor(in vec3 rd) {\r\n    return RGBMDecode(textureCube(envMap, adjustLookupVector(rd)), envMapExposure);\r\n}\r\n\r\nvoid main() {\r\n    vec3 rd = rayDir(vUv);\r\n    vec3 outColor;\r\n\r\n    if (envMapBackground) {\r\n        outColor = getColor(rd);\r\n#if TONEMAP_OUTPUT == 1\r\n        outColor = toneMapCanonOGS_WithGamma_WithColorPerserving(exposureBias * outColor);\r\n#elif TONEMAP_OUTPUT == 2\r\n        outColor = toneMapCanonFilmic_WithGamma(exposureBias * outColor);\r\n#endif\r\n    }\r\n    else {\r\n        outColor = vColor;\r\n    }\r\n\r\n    gl_FragColor = vec4(orderedDithering(outColor), 1.0);\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n}\r\n"
    },
    function(a, b, c) {
        "use strict";
        var d = c(5),
            e = {
                uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib.common, THREE.UniformsLib.fog, THREE.UniformsLib.shadowmap, d.CutPlanesUniforms, d.IdUniforms, d.ThemingUniform, d.PointSizeUniforms, d.WideLinesUniforms]),
                vertexShader: c(33),
                fragmentShader: c(34)
            };
        THREE.ShaderLib.firefly_basic = e,
            a.exports = e
    },
    function(a, b, c) {
        "use strict";
        function d(a) {
            return ["#if defined( USE_SURFACE_ALBEDO_MAP ) || defined( USE_SURFACE_ROUGHNESS_MAP ) || defined( USE_SURFACE_CUTOUT_MAP ) || defined( USE_SURFACE_ANISOTROPY_MAP ) || defined( USE_SURFACE_ROTATION_MAP ) || defined( USE_OPAQUE_ALBEDO_MAP ) || defined( USE_OPAQUE_F0_MAP ) || defined( USE_OPAQUE_LUMINANCE_MODIFIER_MAP ) || defined( USE_LAYERED_BOTTOM_F0_MAP ) || defined( USE_LAYERED_F0_MAP ) || defined( USE_LAYERED_DIFFUSE_MAP ) || defined( USE_LAYERED_FRACTION_MAP ) || defined( USE_LAYERED_ROUGHNESS_MAP ) || defined( USE_LAYERED_ANISOTROPY_MAP ) || defined( USE_LAYERED_ROTATION_MAP ) || defined( USE_METAL_F0_MAP ) || defined( USE_SURFACE_NORMAL_MAP ) || defined( USE_LAYERED_NORMAL_MAP )", "#define " + a, "#endif"].join("\n")
        }
        function e(a, b, c, d) {
            var e = c ? "_v3": "",
                f = c ? "vec3 ": "",
                g = c ? b + " = averageOfFloat3(" + b + e + ");": "",
                h = d ? b + e + " = SRGBToLinear(" + b + e + ");": "";
            return ["#if defined( USE_" + a.toUpperCase() + "_MAP )", "vec2 uv_" + a + "_map = (" + a + "_map_texMatrix * vec3(vUv, 1.0)).xy;", a.toUpperCase() + "_CLAMP_TEST;", f + b + e + " = texture2D(" + a + "_map, uv_" + a + "_map).xyz;", h, "if(" + a + "_map_invert) " + b + e + " = vec3(1.0) - " + b + e + ";", g, "#else", b + " = " + a + ";", "#endif"].join("\n")
        }
        function f(a) {
            var b = a + "_texMatrix",
                c = a + "_invert";
            return ["#if defined( " + ("USE_" + a).toUpperCase() + " )", "uniform sampler2D " + a + ";", "uniform mat3 " + b + ";", "uniform bool " + c + ";", "#endif"].join("\n")
        }
        function g(a) {
            var b = a + "_texMatrix",
                c = a + "_bumpScale",
                d = a + "_bumpmapType";
            return ["#if defined( " + ("USE_" + a).toUpperCase() + " )", "uniform sampler2D " + a + ";", "uniform mat3 " + b + ";", "uniform vec2 " + c + ";", "uniform int " + d + ";", "#endif"].join("\n")
        }
        var h = c(6),
            i = {
                cutplanes: {
                    type: "v4v",
                    value: []
                },
                hatchParams: {
                    type: "v2",
                    value: new h.Vector2(1, 10)
                },
                hatchTintColor: {
                    type: "c",
                    value: new h.Color(16777215)
                },
                hatchTintIntensity: {
                    type: "f",
                    value: 1
                }
            },
            j = {
                dbId: {
                    type: "v3",
                    value: new h.Vector3(0, 0, 0)
                },
                modelId: {
                    type: "v3",
                    value: new h.Vector3(0, 0, 0)
                }
            },
            k = {
                themingColor: {
                    type: "v4",
                    value: new h.Vector4(0, 0, 0, 0)
                }
            },
            l = {
                shadowESMConstant: {
                    type: "f",
                    value: 0
                }
            },
            m = h.UniformsUtils.merge([{
                shadowMap: {
                    type: "t",
                    value: null
                },
                shadowMapSize: {
                    type: "v2",
                    value: new h.Vector2(0, 0)
                },
                shadowBias: {
                    type: "f",
                    value: 0
                },
                shadowDarkness: {
                    type: "f",
                    value: 0
                },
                shadowMatrix: {
                    type: "m4",
                    value: new h.Matrix4
                },
                shadowLightDir: {
                    type: "v3",
                    value: new h.Vector3
                }
            },
                l]),
            n = {
                point_size: {
                    type: "f",
                    value: 1
                }
            },
            o = {
                view_size: {
                    type: "v2",
                    value: new h.Vector2(640, 480)
                }
            },
            p = {};
        for (var q in h.ShaderChunk) p[q] = h.ShaderChunk[q];
        p.pack_depth = c(7),
            p.tonemap = c(8),
            p.ordered_dither = c(9),
            p.cutplanes = c(10),
            p.pack_normals = c(11),
            p.hatch_pattern = c(12),
            p.env_sample = c(13),
            p.id_decl_vert = c(14),
            p.id_vert = c(15),
            p.id_decl_frag = c(16),
            p.id_frag = c(17),
            p.final_frag = c(18),
            p.theming_decl_frag = c(19),
            p.theming_frag = c(20),
            p.instancing_decl_vert = c(21),
            p.shadowmap_decl_common = c(22),
            p.shadowmap_decl_vert = c(23),
            p.shadowmap_vert = c(24),
            p.shadowmap_decl_frag = c(25),
            p.float3_average = c(26),
            p.line_decl_common = c(27),
            p.prism_wood = c(28),
            p.decl_point_size = c(29),
            p.point_size = c(30),
            p.wide_lines_decl = c(31),
            p.wide_lines_vert = c(32);
        var r = {};
        r.prism_check = d,
            r.prism_sample_texture = function(a, b, c, d) {
                return e(a, b, "true" === c, "true" === d)
            },
            r.prism_uniforms = f,
            r.prism_bump_uniforms = g;
        var s = {};
        for (q in r) s[q] = new RegExp("#" + q + " *<([\\w\\d., ]*)>", "g");
        var t = function a(b) {
            for (var c in r) {
                var d = s[c];
                b = b.replace(d,
                    function(a, b) {
                        var d = b.split(",").map(function(a) {
                            return a.trim()
                        });
                        return r[c].apply(null, d)
                    })
            }
            var e = /#include *<([\w\d.]+)>/g,
                f = function(b, c) {
                    if (!p[c]) throw new Error("Cannot resolve #include<" + c + ">");
                    return a(p[c])
                };
            return b.replace(e, f)
        };
        a.exports = {
            IdUniforms: j,
            ThemingUniform: k,
            CutPlanesUniforms: i,
            ShadowMapCommonUniforms: l,
            ShadowMapUniforms: m,
            PointSizeUniforms: n,
            WideLinesUniforms: o,
            PackDepthShaderChunk: p.pack_depth,
            TonemapShaderChunk: p.tonemap,
            OrderedDitheringShaderChunk: p.ordered_dither,
            CutPlanesShaderChunk: p.cutplanes,
            PackNormalsShaderChunk: p.pack_normals,
            HatchPatternShaderChunk: p.hatch_pattern,
            EnvSamplingShaderChunk: p.env_sample,
            IdVertexDeclaration: p.id_decl_vert,
            IdVertexShaderChunk: p.id_vert,
            IdFragmentDeclaration: p.id_decl_frag,
            IdOutputShaderChunk: p.id_frag,
            FinalOutputShaderChunk: p.final_frag,
            ThemingFragmentDeclaration: p.theming_decl_frag,
            ThemingFragmentShaderChunk: p.theming_frag,
            InstancingVertexDeclaration: p.instancing_decl_vert,
            ShadowMapDeclareCommonUniforms: p.shadowmap_decl_common,
            ShadowMapVertexDeclaration: p.shadowmap_decl_vert,
            ShadowMapVertexShaderChunk: p.shadowmap_vert,
            ShadowMapFragmentDeclaration: p.shadowmap_decl_frag,
            AverageOfFloat3: p.float3_average,
            PointSizeDeclaration: p.decl_point_size,
            PointSizeShaderChunk: p.point_size,
            GetPrismMapSampleChunk: e,
            GetPrismMapUniformChunk: f,
            resolve: t
        }
    },
    function(a, b) {
        a.exports = THREE
    },
    function(a, b) {
        a.exports = "\nvec4 packDepth( const in float depth ) {\n    vec4 enc = vec4(1.0, 255.0, 65025.0, 160581375.0) * depth;\n    enc = fract(enc);\n    enc -= enc.yzww * vec4(1.0/255.0,1.0/255.0,1.0/255.0,0.0);\n    return enc;\n}\nfloat unpackDepth( const in vec4 rgba_depth ) {\n    return dot( rgba_depth, vec4(1.0, 1.0/255.0, 1.0/65025.0, 1.0/160581375.0) );\n}\n"
    },
    function(a, b) {
        a.exports = "\nfloat luminance_post(vec3 rgb) {\n    return dot(rgb, vec3(0.299, 0.587, 0.114));\n}\nfloat luminance_pre(vec3 rgb) {\n    return dot(rgb, vec3(0.212671, 0.715160, 0.072169));\n}\nvec3 xyz2rgb(vec3 xyz) {\n    vec3 R = vec3( 3.240479, -1.537150, -0.498535);\n    vec3 G = vec3(-0.969256,  1.875992,  0.041556);\n    vec3 B = vec3( 0.055648, -0.204043,  1.057311);\n    vec3 rgb;\n    rgb.b = dot(xyz, B);\n    rgb.g = dot(xyz, G);\n    rgb.r = dot(xyz, R);\n    return rgb;\n}\nvec3 rgb2xyz(vec3 rgb) {\n    vec3 X = vec3(0.412453, 0.35758, 0.180423);\n    vec3 Y = vec3(0.212671, 0.71516, 0.0721688);\n    vec3 Z = vec3(0.0193338, 0.119194, 0.950227);\n    vec3 xyz;\n    xyz.x = dot(rgb, X);\n    xyz.y = dot(rgb, Y);\n    xyz.z = dot(rgb, Z);\n    return xyz;\n}\nvec3 xyz2xyY(vec3 xyz) {\n    float sum = xyz.x + xyz.y + xyz.z;\n    sum = 1.0 / sum;\n    vec3 xyY;\n    xyY.z = xyz.y;\n    xyY.x = xyz.x * sum;\n    xyY.y = xyz.y * sum;\n    return xyY;\n}\nvec3 xyY2xyz(vec3 xyY) {\n    float x = xyY.x;\n    float y = xyY.y;\n    float Y = xyY.z;\n    vec3 xyz;\n    xyz.y = Y;\n    xyz.x = x * (Y / y);\n    xyz.z = (1.0 - x - y) * (Y / y);\n    return xyz;\n}\nfloat toneMapCanon_T(float x)\n{\n    float xpow = pow(x, 1.60525727);\n    float tmp = ((1.05542877*4.68037409)*xpow) / (4.68037409*xpow + 1.0);\n    return clamp(tmp, 0.0, 1.0);\n}\nconst float Shift = 1.0 / 0.18;\nfloat toneMapCanonFilmic_NoGamma(float x) {\n    x *= Shift;\n    const float A = 0.2;\n    const float B = 0.34;\n    const float C = 0.002;\n    const float D = 1.68;\n    const float E = 0.0005;\n    const float F = 0.252;\n    const float scale = 1.0/0.833837;\n    return (((x*(A*x+C*B)+D*E)/(x*(A*x+B)+D*F))-E/F) * scale;\n}\nvec3 toneMapCanonFilmic_WithGamma(vec3 x) {\n    x *= Shift;\n    const float A = 0.27;\n    const float B = 0.29;\n    const float C = 0.052;\n    const float D = 0.2;\n    const float F = 0.18;\n    const float scale = 1.0/0.897105;\n    return (((x*(A*x+C*B))/(x*(A*x+B)+D*F))) * scale;\n}\nvec3 toneMapCanonOGS_WithGamma_WithColorPerserving(vec3 x) {\n    vec3 outColor = x.rgb;\n    outColor = min(outColor, vec3(3.0));\n    float inLum = luminance_pre(outColor);\n    if (inLum > 0.0) {\n        float outLum = toneMapCanon_T(inLum);\n        outColor = outColor * (outLum / inLum);\n        outColor = clamp(outColor, vec3(0.0), vec3(1.0));\n    }\n    float gamma = 1.0/2.2;\n    outColor = pow(outColor, vec3(gamma));\n    return outColor;\n}\n"
    },
    function(a, b) {
        a.exports = "vec3 orderedDithering(vec3 col) {\n    const vec4 m0 = vec4( 1.0, 13.0,  4.0, 16.0);\n    const vec4 m1 = vec4( 9.0,  5.0, 12.0,  8.0);\n    const vec4 m2 = vec4( 3.0, 15.0,  2.0, 14.0);\n    const vec4 m3 = vec4(11.0,  7.0, 10.0,  6.0);\n    int i = int(mod(float(gl_FragCoord.x), 4.0));\n    int j = int(mod(float(gl_FragCoord.y), 4.0));\n    vec4 biasRow;\n    if      (i==0) biasRow = m0;\n    else if (i==1) biasRow = m1;\n    else if (i==2) biasRow = m2;\n    else           biasRow = m3;\n    float bias;\n    if      (j==0) bias = biasRow.x;\n    else if (j==1) bias = biasRow.y;\n    else if (j==2) bias = biasRow.z;\n    else           bias = biasRow.w;\n    return col + bias / 17.0 / 256.0;\n}\n"
    },
    function(a, b) {
        a.exports = "#if NUM_CUTPLANES > 0\nuniform vec4 cutplanes[NUM_CUTPLANES];\nvoid checkCutPlanes(vec3 worldPosition) {\n    for (int i=0; i<NUM_CUTPLANES; i++) {\n        if (dot(vec4(worldPosition, 1.0), cutplanes[i]) > 0.0) {\n            discard;\n        }\n    }\n}\n#endif\n"
    },
    function(a, b) {
        a.exports = "\n#define kPI 3.14159265358979\nvec2 encodeNormal (vec3 n) {\n    return (vec2(atan(n.y,n.x)/kPI, n.z)+1.0)*0.5;\n}\nvec3 decodeNormal (vec2 enc) {\n    vec2 ang = enc * 2.0 - 1.0;\n    vec2 scth = vec2(sin(ang.x * kPI), cos(ang.x * kPI));\n    vec2 scphi = vec2(sqrt(1.0 - ang.y * ang.y), ang.y);\n    return vec3(scth.y * scphi.x, scth.x * scphi.x, scphi.y);\n}\n"
    },
    function(a, b) {
        a.exports = "#ifdef HATCH_PATTERN\nuniform vec2 hatchParams;\nuniform vec3 hatchTintColor;\nuniform float hatchTintIntensity;\nfloat curveGaussian(float r, float invWidth) {\n    float amt = clamp(r * invWidth, 0.0, 1.0);\n    float exponent = amt * 3.5;\n    return exp(-exponent*exponent);\n}\nvec4 calculateHatchPattern(vec2 hatchParams, vec2 coord, vec4 fragColor, vec3 hatchTintColor, float hatchTintIntensity ) {\n    float hatchSlope = hatchParams.x;\n    float hatchPeriod = hatchParams.y;\n    if (abs(hatchSlope) <= 1.0) {\n        float hatchPhase = coord.y - hatchSlope * coord.x;\n        float dist = abs(mod((hatchPhase), (hatchPeriod)));\n        if (dist < 1.0) {\n            fragColor = vec4(0.0,0.0,0.0,1.0);\n        } else {\n            fragColor.xyz = mix(fragColor.xyz, hatchTintColor, hatchTintIntensity);\n        }\n    } else {\n        float hatchPhase = - coord.y / hatchSlope + coord.x;\n        float dist = abs(mod((hatchPhase), (hatchPeriod)));\n        if (dist < 1.0) {\n            fragColor = vec4(0.0,0.0,0.0,1.0);\n        } else {\n            fragColor.xyz = mix(fragColor.xyz, hatchTintColor, hatchTintIntensity);\n        }\n    }\n    return fragColor;\n}\n#endif\n"
    },
    function(a, b) {
        a.exports = "\nuniform float envRotationSin;\nuniform float envRotationCos;\nvec3 adjustLookupVector(in vec3 lookup) {\n    return vec3(\n            envRotationCos * lookup.x - envRotationSin * lookup.z,\n            lookup.y,\n            envRotationSin * lookup.x + envRotationCos * lookup.z);\n}\nvec3 RGBMDecode(in vec4 vRGBM, in float exposure) {\n    vec3 ret = vRGBM.rgb * (vRGBM.a * 16.0);\n    ret *= ret;\n    ret *= exposure;\n    return ret;\n}\nvec3 GammaDecode(in vec4 vRGBA, in float exposure) {\n    return vRGBA.xyz * vRGBA.xyz * exposure;\n}\nvec3 sampleIrradianceMap(vec3 dirWorld, samplerCube irrMap, float exposure) {\n    vec4 cubeColor4 = textureCube(irrMap, adjustLookupVector(dirWorld));\n#ifdef IRR_GAMMA\n    vec3 indirectDiffuse = GammaDecode(cubeColor4, exposure);\n#elif defined(IRR_RGBM)\n    vec3 indirectDiffuse = RGBMDecode(cubeColor4, exposure);\n#else\n    vec3 indirectDiffuse = cubeColor4.xyz;\n#ifdef GAMMA_INPUT\n    indirectDiffuse.xyz *= indirectDiffuse.xyz;\n#endif\n#endif\n    return indirectDiffuse;\n}\n"
    },
    function(a, b) {
        a.exports = "#ifdef USE_VERTEX_ID\nattribute vec3 id;\nvarying   vec3 vId;\n#endif\n"
    },
    function(a, b) {
        a.exports = "\n#ifdef USE_VERTEX_ID\nvId = id;\n#endif\n"
    },
    function(a, b) {
        a.exports = "#if defined(MRT_NORMALS) || defined(MRT_ID_BUFFER)\nvarying highp float depth;\n#define gl_FragColor gl_FragData[0]\n#endif\n#if defined(MRT_ID_BUFFER) || defined(ID_COLOR)\n#ifdef USE_VERTEX_ID\nvarying vec3 vId;\n#else\nuniform vec3 dbId;\n#endif\n#endif\n#if defined(MRT_ID_BUFFER) || defined(MODEL_COLOR)\nuniform vec3 modelId;\n#endif\n"
    },
    function(a, b) {
        a.exports = "\n#if defined(USE_VERTEX_ID) && (defined(MRT_ID_BUFFER) || defined(ID_COLOR))\nvec3 dbId = vId;\n#endif\n#ifdef MRT_ID_BUFFER\n#ifdef MRT_NORMALS\nconst int index = 2;\n#else\nconst int index = 1;\n#endif\n#ifndef ENABLE_ID_DISCARD\nconst float writeId = 1.0;\n#endif\ngl_FragData[index] = vec4(dbId.rgb, writeId);\n#ifdef MODEL_COLOR\ngl_FragData[index+1] = vec4(modelId.rgb, writeId);\n#endif\n#elif defined(ID_COLOR)\n#ifdef ENABLE_ID_DISCARD\nif (writeId==0.0) {\n    discard;\n}\n#endif\ngl_FragColor = vec4(dbId.rgb, 1.0);\n#elif defined(MODEL_COLOR)\n#ifdef ENABLE_ID_DISCARD\nif (writeId==0.0) {\n    discard;\n}\n#endif\ngl_FragColor = vec4(modelId.rgb, 1.0);\n#endif\n"
    },
    function(a, b) {
        a.exports = "#ifdef HATCH_PATTERN\ngl_FragColor = calculateHatchPattern(hatchParams, gl_FragCoord.xy, gl_FragColor, hatchTintColor, hatchTintIntensity);\n#endif\n#if defined(USE_LOGDEPTHBUF) && defined(USE_LOGDEPTHBUF_EXT)\ngl_FragDepthEXT = log2(vFragDepth) * logDepthBufFC * 0.5;\n#endif\n#ifdef MRT_NORMALS\ngl_FragData[1] = vec4(geomNormal.x, geomNormal.y, depth, gl_FragColor.a < 1.0 ? 0.0 : 1.0);\n#endif\n#include<id_frag>\n"
    },
    function(a, b) {
        a.exports = "uniform vec4 themingColor;\n"
    },
    function(a, b) {
        a.exports = "gl_FragColor.rgb = mix(gl_FragColor.rgb, themingColor.rgb, themingColor.a);\n"
    },
    function(a, b) {
        a.exports = "\n#ifdef USE_INSTANCING\nattribute vec3 instOffset;\nattribute vec4 instRotation;\nattribute vec3 instScaling;\nvec3 applyQuaternion(vec3 p, vec4 q) {\n    return p + 2.0 * cross(q.xyz, cross(q.xyz, p) + q.w * p);\n}\nvec3 getInstancePos(vec3 pos) {\n    return instOffset + applyQuaternion(instScaling * pos, instRotation);\n}\nvec3 getInstanceNormal(vec3 normal) {\n    return applyQuaternion(normal/instScaling, instRotation);\n}\n#else\nvec3 getInstancePos(vec3 pos)       { return pos;    }\nvec3 getInstanceNormal(vec3 normal) { return normal; }\n#endif\n"
    },
    function(a, b) {
        a.exports = "\nuniform float shadowESMConstant;\nuniform float shadowMapRangeMin;\nuniform float shadowMapRangeSize;\n"
    },
    function(a, b) {
        a.exports = "\n#ifdef USE_SHADOWMAP\nvarying vec4 vShadowCoord;\nuniform mat4 shadowMatrix;\n#endif\n"
    },
    function(a, b) {
        a.exports = "\n#ifdef USE_SHADOWMAP\n{\n    vec4 worldPosition = modelMatrix * vec4( position, 1.0 );\n    vShadowCoord = shadowMatrix * worldPosition;\n}\n#endif\n"
    },
    function(a, b) {
        a.exports = "\n#ifdef USE_SHADOWMAP\nuniform sampler2D shadowMap;\nuniform vec2      shadowMapSize;\nuniform float     shadowDarkness;\nuniform float     shadowBias;\nuniform vec3      shadowLightDir;\nvarying vec4 vShadowCoord;\n#include<shadowmap_decl_common>\nfloat getShadowValue() {\n    float fDepth;\n    vec3 shadowColor = vec3( 1.0 );\n    vec3 shadowCoord = vShadowCoord.xyz / vShadowCoord.w;\n    shadowCoord.xyz = 0.5 * (shadowCoord.xyz + vec3(1.0, 1.0, 1.0));\n    bvec4 inFrustumVec = bvec4 ( shadowCoord.x >= 0.0, shadowCoord.x <= 1.0, shadowCoord.y >= 0.0, shadowCoord.y <= 1.0 );\n    bool inFrustum = all( inFrustumVec );\n    float shadowValue = 1.0;\n    if (inFrustum) {\n        shadowCoord.z = min(0.999, shadowCoord.z);\n        shadowCoord.z -= shadowBias;\n#ifdef USE_HARD_SHADOWS\n        vec4 rgbaDepth = texture2D( shadowMap, shadowCoord.xy );\n        float fDepth = rgbaDepth.r;\n        if ( fDepth < shadowCoord.z ) {\n            shadowValue = 1.0 - shadowDarkness;\n        }\n#else\n        vec4 rgbaDepth = texture2D( shadowMap, shadowCoord.xy );\n        float shadowMapValue = rgbaDepth.r;\n        shadowValue = exp(-shadowESMConstant * shadowCoord.z) * shadowMapValue;\n        shadowValue = min(shadowValue, 1.0);\n        shadowValue = mix(1.0 - shadowDarkness, 1.0, shadowValue);\n#endif\n    }\n    return shadowValue;\n}\n#else\nfloat getShadowValue() { return 1.0; }\n#endif\nvec3 applyEnvShadow(vec3 colorWithoutShadow, vec3 worldNormal) {\n#if defined(USE_SHADOWMAP)\n    float dp  = dot(shadowLightDir, worldNormal);\n    float dpValue = (dp + 1.0) / 2.0;\n    dpValue = min(1.0, dpValue * 1.5);\n    float sv = getShadowValue();\n    vec3 result = colorWithoutShadow * min(sv, dpValue);\n    return result;\n#else\n    return colorWithoutShadow;\n#endif\n}\n"
    },
    function(a, b) {
        a.exports = "float averageOfFloat3(in vec3 value) { \n    const float oneThird = 1.0 / 3.0; \n    return dot(value, vec3(oneThird, oneThird, oneThird)); \n} \n"
    },
    function(a, b) {
        a.exports = "\r\n#define TAU     6.28318530718\r\n#define PI      3.14159265358979\r\n#define HALF_PI 1.57079632679\r\n#define PI_0_5  HALF_PI\r\n#define PI_1_5  4.71238898038\r\n\r\n#define ENABLE_ID_DISCARD\r\n\r\n\r\n#define VBB_GT_TRIANGLE_INDEXED  0.0\r\n#define VBB_GT_LINE_SEGMENT      1.0\r\n#define VBB_GT_ARC_CIRCULAR      2.0\r\n#define VBB_GT_ARC_ELLIPTICAL    3.0\r\n#define VBB_GT_TEX_QUAD          4.0\r\n#define VBB_GT_ONE_TRIANGLE      5.0\r\n\r\n\r\n#define VBB_INSTANCED_FLAG   0.0\r\n#define VBB_SEG_START_RIGHT  0.0\r\n#define VBB_SEG_START_LEFT   1.0\r\n#define VBB_SEG_END_RIGHT    2.0\r\n#define VBB_SEG_END_LEFT     3.0\r\n\r\n\r\nvarying vec4 fsColor;\r\nvarying vec4 dbId;\r\nvarying vec2 fsOffsetDirection;\r\nvarying vec4 fsMultipurpose;\r\n\r\nvarying float fsHalfWidth;\r\nvarying vec2 fsVpTC;\r\nvarying float fsGhosting;\r\n"
    },
    function(a, b) {
        a.exports = "\n#if defined( PRISMWOOD )\n\nfloat GetIndexedValue(vec4 _0, int _1) {\n  if(_1 == 0)\n    return _0[0];\n  else if(_1 == 1)\n    return _0[1];\n  else if(_1 == 2)\n    return _0[2];\n  else if(_1 == 3)\n    return _0[3];\n  else\n    return 0.0;\n  \n  \n  \n  \n}\nint GetIndexedValue(ivec2 _0, int _1) {\n  if(_1 == 0)\n    return _0[0];\n  else if(_1 == 1)\n    return _0[1];\n  else\n    return 0;\n  \n  \n}\n#if defined( USE_WOOD_CURLY_DISTORTION_MAP )\n\nfloat SampleCurlyPattern(vec2 _2) {\n  vec2 _3 = (wood_curly_distortion_map_texMatrix * vec3(_2, 1.0)).xy;\n  WOOD_CURLY_DISTORTION_CLAMP_TEST;\n  vec3 _4 = texture2D(wood_curly_distortion_map, _3).xyz;\n  if(wood_curly_distortion_map_invert)\n    _4 = vec3(1.0) - _4;\n  return _4.r;\n}\nvec3 DistortCurly(vec3 _5) {\n  if(!wood_curly_distortion_enable)\n    return _5;\n  float _6 = length(_5.xy);\n  if(_6 < 0.00001)\n    return _5;\n  const float _7 = 1.27323954;\n  const float _8 = 8.0;\n  const float _9 = 6.283185308;\n  float _a = atan(_5.y, _5.x);\n  if(_a < 0.0)\n    _a += _9;\n  float _b = _a * _7;\n  int _c = int(mod(floor(_b), _8));\n  int _d = int(mod(ceil(_b), _8));\n  const vec4 _e = vec4(0.450572, 0.114598, 0.886043, 0.315119);\n  const vec4 _f = vec4(0.216133, 0.306264, 0.685616, 0.317907);\n  float _g = _c < 4 ? GetIndexedValue(_e, _c) : GetIndexedValue(_f, _c - 4);\n  float _h = _d < 4 ? GetIndexedValue(_e, _d) : GetIndexedValue(_f, _d - 4);\n  const float _i = 100.0;\n  _g = (_g - 0.5) * _i;\n  _h = (_h - 0.5) * _i;\n  vec2 _j = vec2(_5.z + _g, _6);\n  float _k = SampleCurlyPattern(_j);\n  vec2 _l = vec2(_5.z + _h, _6);\n  float _m = SampleCurlyPattern(_l);\n  float _n = fract(_b);\n  float _o = mix(_k, _m, _n);\n  const float _p = 2.0;\n  float _q = smoothstep(0.0, 1.0, _6 * _p);\n  _6 -= wood_curly_distortion_scale * (_o * _q);\n  float _r = atan(_5.y, _5.x);\n  vec3 _s = _5;\n  _s.x = _6 * cos(_r);\n  _s.y = _6 * sin(_r);\n  return _s;\n}\n#endif\n\nvec3 un2sn(vec3 _t) {\n  return _t * 2.0 - 1.0;\n}\nfloat inoise(vec3 _5) {\n  vec3 _u = mod(floor(_5), 256.0);\n  _u.xy = _u.xy * ONE;\n  vec4 _v = texture2D(perm2DMap, vec2(_u.x, _u.y), 0.0) * 255.0;\n  _v = _v + _u.z;\n  _v = mod(floor(_v), 256.0);\n  _v *= ONE;\n  vec3 _10 = un2sn(texture2D(permGradMap, vec2(_v.x, 0.0), 0.0).xyz);\n  vec3 _11 = un2sn(texture2D(permGradMap, vec2(_v.y, 0.0), 0.0).xyz);\n  vec3 _12 = un2sn(texture2D(permGradMap, vec2(_v.z, 0.0), 0.0).xyz);\n  vec3 _13 = un2sn(texture2D(permGradMap, vec2(_v.w, 0.0), 0.0).xyz);\n  vec3 _14 = un2sn(texture2D(permGradMap, vec2(_v.x + ONE, 0.0), 0.0).xyz);\n  vec3 _15 = un2sn(texture2D(permGradMap, vec2(_v.y + ONE, 0.0), 0.0).xyz);\n  vec3 _16 = un2sn(texture2D(permGradMap, vec2(_v.z + ONE, 0.0), 0.0).xyz);\n  vec3 _17 = un2sn(texture2D(permGradMap, vec2(_v.w + ONE, 0.0), 0.0).xyz);\n  _5 -= floor(_5);\n  vec3 _18 = _5 * _5 * _5 * (_5 * (_5 * 6.0 - 15.0) + 10.0);\n  return mix(mix(mix(dot(_10, _5), dot(_12, _5 + vec3(-1.0, 0.0, 0.0)), _18.x), mix(dot(_11, _5 + vec3(0.0, -1.0, 0.0)), dot(_13, _5 + vec3(-1.0, -1.0, 0.0)), _18.x), _18.y), mix(mix(dot(_14, _5 + vec3(0.0, 0.0, -1.0)), dot(_16, _5 + vec3(-1.0, 0.0, -1.0)), _18.x), mix(dot(_15, _5 + vec3(0.0, -1.0, -1.0)), dot(_17, _5 + vec3(-1.0, -1.0, -1.0)), _18.x), _18.y), _18.z);\n}\nfloat inoise(float _5) {\n  float _u = mod(floor(_5), 256.0);\n  _u = (_u + 256.0) * ONE;\n  float _19 = texture2D(permutationMap, vec2(_u, 0.0), 0.0).r;\n  float _1a = texture2D(gradientMap, vec2(_19, 0.0), 0.0).r * 2.0 - 1.0;\n  float _1b = texture2D(permutationMap, vec2(_u + ONE, 0.0), 0.0).r;\n  float _1c = texture2D(gradientMap, vec2(_1b, 0.0), 0.0).r * 2.0 - 1.0;\n  _5 -= floor(_5);\n  float _18 = _5 * _5 * _5 * (_5 * (_5 * 6.0 - 15.0) + 10.0);\n  return mix(_1a * _5, _1c * (_5 - 1.0), _18);\n}\nfloat multiband_inoise(vec3 _5, int _1d, vec4 _1e, vec4 _1f) {\n  float _1g = 0.0;\n  for(int _1h = 0; _1h < 4; ++_1h) {\n    if(_1h >= _1d)\n      break;\n    _1g += GetIndexedValue(_1e, _1h) * inoise(_5 * GetIndexedValue(_1f, _1h));\n  }\n  return _1g;\n}\nfloat multiband_inoise(float _5, int _1d, vec4 _1e, vec4 _1f) {\n  float _1g = 0.0;\n  for(int _1h = 0; _1h < 4; ++_1h) {\n    if(_1h >= _1d)\n      break;\n    _1g += GetIndexedValue(_1e, _1h) * inoise(_5 * GetIndexedValue(_1f, _1h));\n  }\n  return _1g;\n}\nvec3 Distort3DCosineRadialDir(vec3 _5) {\n  float _1i = length(_5.xy);\n  if(_1i < 0.00001)\n    return _5;\n  vec2 _a = _5.xy / _1i;\n  float _1j = 0.0;\n  for(int _1h = 0; _1h < 4; ++_1h) {\n    if(_1h >= wood_fiber_cosine_bands)\n      break;\n    _1j += GetIndexedValue(wood_fiber_cosine_weights, _1h) * cos(_5.z * RECIPROCAL_2PI * GetIndexedValue(wood_fiber_cosine_frequencies, _1h));\n  }\n  const float _1k = 1.5;\n  float _1l = clamp(_1i / _1k, 0.0, 1.0);\n  if(_1l >= 0.5)\n    _1l = _1l * _1l * (3.0 - (_1l + _1l));\n  _5.xy += _a * _1j * _1l;\n  return _5;\n}\nvec3 Distort3DPerlin(vec3 _5) {\n  vec3 _1m = vec3(_5.xy, _5.z * wood_fiber_perlin_scale_z);\n  _5.xy += multiband_inoise(_1m, wood_fiber_perlin_bands, wood_fiber_perlin_weights, wood_fiber_perlin_frequencies);\n  return _5;\n}\nvec3 Distort(vec3 _5) {\n  if(wood_fiber_cosine_enable)\n    _5 = Distort3DCosineRadialDir(_5);\n  if(wood_fiber_perlin_enable)\n    _5 = Distort3DPerlin(_5);\n  return _5;\n}\nfloat DistortRadiusLength(float _1n) {\n  _1n += multiband_inoise(_1n, wood_growth_perlin_bands, wood_growth_perlin_weights, wood_growth_perlin_frequencies);\n  if(_1n < 0.0)\n    _1n = 0.0;\n  return _1n;\n}\nfloat ComputeEarlyWoodRatio(float _1n) {\n  float _1o = mod(_1n, wood_ring_thickness) / wood_ring_thickness;\n  if(_1o <= wood_ring_fraction.y)\n    return 1.0;\n  else if(_1o <= wood_ring_fraction.x)\n    return (1.0 - (_1o - wood_ring_fraction.y) / wood_fall_rise.x);\n  else if(_1o <= wood_ring_fraction.w)\n    return 0.0;\n  else\n    return ((_1o - wood_ring_fraction.w) / wood_fall_rise.y);\n  \n  \n  \n}\nvec3 DistortEarlyColor(vec3 _1p, float _1n) {\n  float _1q = 1.0 + multiband_inoise(_1n, wood_earlycolor_perlin_bands, wood_earlycolor_perlin_weights, wood_earlycolor_perlin_frequencies);\n  _1p = pow(abs(_1p), vec3(_1q));\n  return _1p;\n}\nvec3 DistortLateColor(vec3 _1r, float _1n) {\n  float _1q = 1.0 + multiband_inoise(_1n, wood_latecolor_perlin_bands, wood_latecolor_perlin_weights, wood_latecolor_perlin_frequencies);\n  _1r = pow(abs(_1r), vec3(_1q));\n  return _1r;\n}\nvec3 DistortDiffuseColor(vec3 _1s, vec3 _5) {\n  _5.z *= wood_diffuse_perlin_scale_z;\n  float _1q = 1.0 + multiband_inoise(_5, wood_diffuse_perlin_bands, wood_diffuse_perlin_weights, wood_diffuse_perlin_frequencies);\n  _1s = pow(abs(_1s), vec3(_1q));\n  return _1s;\n}\nfloat LayerRoughnessVar(float _1t, float _1u) {\n  return _1u * wood_groove_roughness + (1.0 - _1u) * _1t;\n}\nfloat hashword(vec2 _1v) {\n  _1v = mod(_1v, vec2(256.0)) * ONE;\n  float _20 = texture2D(permutationMap, vec2(_1v.x, 0.0)).x + _1v.y;\n  _20 = texture2D(permutationMap, vec2(_20, 0.0)).x;\n  return _20 * 255.0;\n}\nfloat wyvillsq(float _21) {\n  if(_21 >= 1.0)\n    return 0.0;\n  float _22 = 1.0 - _21;\n  return _22 * _22 * _22;\n}\nfloat Weight2DNeighborImpulses(vec3 _5, float _23) {\n  if(_23 <= 0.0)\n    return 0.0;\n  float _24 = wood_pore_radius * _23;\n  vec2 _25 = floor((_5.xy - _24) / wood_pore_cell_dim);\n  vec2 _26 = floor((_5.xy + _24) / wood_pore_cell_dim);\n  float _1l = 0.0;\n  float _27 = 1.0 / (_24 * _24);\n  const float _28 = 1.0 / 15.0;\n  for(int _29 = 0; _29 <= 4; _29++) {\n    if(_29 > int(_26.y - _25.y))\n      continue;\n    for(int _1h = 0; _1h <= 4; _1h++) {\n      if(_1h > int(_26.x - _25.x))\n        continue;\n      vec2 _2a = vec2(float(_1h) + _25.x, float(_29) + _25.y);\n      float _2b = hashword(_2a);\n      float _2c = mod(_2b, 16.0) * _28;\n      float _2d = floor(_2b / 16.0) * _28;\n      _2c = (_2a.x + _2c) * wood_pore_cell_dim;\n      _2d = (_2a.y + _2d) * wood_pore_cell_dim;\n      float _2e = (_5.x - _2c) * (_5.x - _2c) + (_5.y - _2d) * (_5.y - _2d);\n      _1l += wyvillsq(_2e * _27);\n    }\n  }\n  return _1l;\n}\nfloat Weight3DRayImpulses(vec3 _5) {\n  int _2f = int(floor(_5.z / wood_ray_seg_length_z));\n  float _2g = _5.z / wood_ray_seg_length_z - float(_2f);\n  int _2h = _2f - 1;\n  if(_2g > 0.5)\n    _2h = _2f + 1;\n  float _a = atan(_5.y, _5.x);\n  float _2i = floor(((_a + PI) * RECIPROCAL_2PI) * wood_ray_num_slices);\n  if(_2i == wood_ray_num_slices)\n    _2i -= 1.0;\n  ivec2 _2j = ivec2(_2f, _2h);\n  float _1l = 0.0;\n  const float _28 = 1.0 / 15.0;\n  float _2k = 5.0;\n  float _2l = length(_5.xy);\n  for(int _2m = 0; _2m < 2; _2m++) {\n    float _2b = hashword(vec2(_2i, GetIndexedValue(_2j, _2m)));\n    float _2n = mod(_2b, 16.0) * _28;\n    if(_2l < _2k * _2n)\n      continue;\n    float _2o = _2n;\n    _2o = ((_2i + _2o) / wood_ray_num_slices) * (2.0 * PI) - PI;\n    float _2p = (_2b / 16.0) * _28;\n    _2p = (float(GetIndexedValue(_2j, _2m)) + _2p) * wood_ray_seg_length_z;\n    vec3 _2q = vec3(0.0);\n    vec3 _2r = vec3(cos(_2o), sin(_2o), 0.0);\n    vec3 _2s = _5;\n    _2s.z -= _2p;\n    _2s.z /= wood_ray_ellipse_z2x;\n    vec3 _2t = _2r - _2q;\n    vec3 _2u = _2q - _2s;\n    _2u = cross(_2t, _2u);\n    float _2v = length(_2u) / length(_2t);\n    float _27 = 1.0 / (wood_ray_ellipse_radius_x * wood_ray_ellipse_radius_x);\n    _1l += wyvillsq((_2v * _2v) * _27);\n  }\n  return _1l;\n}\nvec3 DarkenColorWithPores(vec3 _5, vec3 _30, float _23) {\n  float _31 = Weight2DNeighborImpulses(_5, _23);\n  float _20 = wood_pore_color_power - 1.0;\n  float _32 = 1.0;\n  float _33 = _20 * _31 + _32;\n  return pow(abs(_30), vec3(_33));\n}\nvec3 DarkenColorWithRays(vec3 _5, vec3 _30) {\n  float _34 = Weight3DRayImpulses(_5);\n  float _20 = wood_ray_color_power - 1.0;\n  float _32 = 1.0;\n  float _33 = _20 * _34 + _32;\n  return pow(abs(_30), vec3(_33));\n}\nfloat ComputeWoodWeight(float _1u) {\n  float _23 = 0.0;\n  if(wood_pore_type == 0)\n    _23 = 1.0;\n  else if(wood_pore_type == 1)\n    _23 = _1u;\n  else if(wood_pore_type == 2)\n    _23 = 1.0 - _1u;\n  else\n    _23 = -1.0;\n  \n  \n  return _23;\n}\n#if defined( PRISMWOODBUMP )\n\nfloat ComputeEarlyWoodRatioAA(float _1n, float _35) {\n  float _36 = min(wood_fall_rise.x, wood_fall_rise.y) * wood_ring_thickness * _35;\n  float _37 = clamp(4.0 / _36, 1.0, 4.0);\n  int _38 = int(_37);\n  float _39 = 1.0 / float(_38);\n  vec2 _3a = vec2(dFdx(_1n), dFdy(_1n)) * _39;\n  float _3b = 0.0;\n  for(int _1h = 0; _1h < 4; ++_1h) {\n    if(_1h >= _38)\n      break;\n    for(int _29 = 0; _29 < 4; ++_29) {\n      if(_29 >= _38)\n        break;\n      float _6 = _1n + dot(vec2(_1h, _29), _3a);\n      _3b += ComputeEarlyWoodRatio(_6);\n    }\n  }\n  return _3b * (_39 * _39);\n}\nfloat LatewoodDepthVariation(float _35) {\n  float _36 = min(wood_fall_rise.x, wood_fall_rise.y) * wood_ring_thickness * _35;\n  return clamp(_36 * 0.5, 0.0, 1.0);\n}\nfloat LatewoodHeightVariation(float _1u, float _3c, float _3d) {\n  return (1.0 - _1u) * _3c * _3d;\n}\nfloat PoreDepthVariation(float _23, float _35) {\n  float _3e = _23 * wood_pore_radius * _35;\n  return clamp(_3e, 0.0, 1.0);\n}\nfloat PoreHeightVariation(float _1u, float _31, float _3f, float _3d) {\n  return _31 * (-1.0 * _3f) * _3d;\n}\nvoid ComputeTangents(vec3 _3g, out vec3 _3h, out vec3 _3i) {\n  float _3j = _3g.z < 0.0 ? -1.0 : 1.0;\n  vec3 _3k = _3j * _3g;\n  float _3l = _3k.z;\n  float _3m = 1.0 / (1.0 + _3l);\n  float _3n = _3m * _3k.y;\n  float _3o = _3n * -_3k.x;\n  _3h = vec3(_3l + _3n * _3k.y, _3o, -_3k.x);\n  _3i = vec3(_3o, _3l + _3m * _3k.x * _3k.x, -_3k.y);\n  _3h *= _3j;\n  _3i *= _3j;\n}\nvec3 WoodBumpHeight(float _3p, float _3q, float _3r, float _3s) {\n  const float _3t = 0.001;\n  float _3u = _3q - _3p;\n  vec3 _3v = vec3(2.0 * _3t, 0.0, _3u);\n  float _40 = _3s - _3r;\n  vec3 _41 = vec3(0.0, 2.0 * _3t, _40);\n  return cross(_3v, _41);\n}\nvec3 SelectNormal(vec3 _42, vec3 _43, vec3 _44) {\n  float _45 = dot(_43, _44);\n  if(_45 > 0.0)\n    return _43;\n  else\n    return _42;\n  \n}\nfloat MinInverseUnitExtent(vec3 _5) {\n  return 1.0 / max(max(length(dFdx(_5.xy)), length(dFdy(_5.xy))), 0.000001);\n}\nfloat HeightVariation(vec3 _46) {\n  vec3 _5 = Distort(_46);\n  float _1n = length(_5.xy);\n  if(wood_growth_perlin_enable)\n    _1n = DistortRadiusLength(_1n);\n  float _35 = MinInverseUnitExtent(_5);\n  float _1u = ComputeEarlyWoodRatioAA(_1n, _35);\n  float _23 = ComputeWoodWeight(_1u);\n  float _31 = Weight2DNeighborImpulses(_5, _23);\n  float _3d = PoreDepthVariation(_23, _35);\n  float _47 = -1.0 * _31 * wood_pore_depth * _3d;\n  float _48 = 0.0;\n  if(wood_use_latewood_bump) {\n    float _49 = LatewoodDepthVariation(_35);\n    _48 = (1.0 - _1u) * wood_latewood_bump_depth * _49;\n  }\n  float _4a = _47 + _48;\n  return _4a;\n}\n#endif\n\nvec3 NoiseWood(vec3 _5, inout float _1t) {\n  _5 = Distort(_5);\n  float _1n = length(_5.xy);\n  if(wood_growth_perlin_enable)\n    _1n = DistortRadiusLength(_1n);\n  \n#if defined( PRISMWOODBUMP )\nfloat _35 = MinInverseUnitExtent(_5);\n  float _1u = ComputeEarlyWoodRatioAA(_1n, _35);\n#else\nfloat _1u = ComputeEarlyWoodRatio(_1n);\n#endif\nvec3 _1p = wood_early_color;\n  if(wood_earlycolor_perlin_enable)\n    _1p = DistortEarlyColor(_1p, _1n);\n  vec3 _1r;\n  if(wood_use_manual_late_color)\n    _1r = wood_manual_late_color;\n  else\n    _1r = pow(abs(_1p), vec3(wood_late_color_power));\n  if(wood_latecolor_perlin_enable)\n    _1r = DistortLateColor(_1r, _1n);\n  vec3 _1s = _1u * _1p + (1.0 - _1u) * _1r;\n  if(wood_diffuse_perlin_enable)\n    _1s = DistortDiffuseColor(_1s, _5);\n  if(wood_use_pores) {\n    float _23 = ComputeWoodWeight(_1u);\n    _1s = DarkenColorWithPores(_5, _1s, _23);\n  }\n  if(wood_use_rays)\n    _1s = DarkenColorWithRays(_5, _1s);\n  if(wood_use_groove_roughness)\n    _1t = LayerRoughnessVar(_1t, _1u);\n  return clamp(_1s, vec3(0.0), vec3(1.0));\n}\n#endif\n"
    },
    function(a, b) {
        a.exports = "uniform float point_size;"
    },
    function(a, b) {
        a.exports = "gl_PointSize = point_size;"
    },
    function(a, b) {
        a.exports = "\n#ifdef WIDE_LINES\nattribute vec3 prev;\nattribute vec3 next;\nattribute float side;\nuniform vec2 view_size;\nvec2 to2d(vec4 i) {\n  return i.xy / i.w;\n}\n#endif\n"
    },
    function(a, b) {
        a.exports = "\n#ifdef WIDE_LINES\nvec4 mvpPosition = projectionMatrix * mvPosition; \nmat3 vectorMatrix = mat3(modelViewMatrix);\nvec2 _pos = to2d(mvpPosition) * view_size;\nvec2 _prev = to2d(projectionMatrix * vec4(mvPosition.xyz + vectorMatrix * (prev * 0.01), 1.0)) * view_size;\nvec2 _next = to2d(projectionMatrix * vec4(mvPosition.xyz - vectorMatrix * (next * 0.01), 1.0)) * view_size;\nvec2 dir1 = _pos - _next;\nvec2 dir2 = _prev - _pos;\ndir2 = (length(dir2) > 0.0000001) ? normalize(dir2) : vec2(0.0, 0.0);\ndir1 = (length(dir1) > 0.0000001) ? normalize(dir1) : dir2;\nvec2 dir_sharp = normalize(dir1 + dir2);\nvec2 dir = normalize(dir1 + dir_sharp);\nvec2 offset = vec2(-dir.y, dir.x);\nfloat len = 1.0 / cross(vec3(offset, 0), vec3(dir1, 0)).z;\noffset *= len;\noffset /= view_size;\noffset *= side;\noffset *= mvpPosition.w;\nmvpPosition.xy += offset;\ngl_Position = mvpPosition;\n#endif\n"
    },
    function(a, b) {
        a.exports = "#include<id_decl_vert>\n#include<decl_point_size>\n#include<common>\n#include<map_pars_vertex>\n#include<lightmap_pars_vertex>\n#include<envmap_pars_vertex>\n#include<color_pars_vertex>\n#include<morphtarget_pars_vertex>\n#include<skinning_pars_vertex>\n#include<logdepthbuf_pars_vertex>\n#include<wide_lines_decl>\n#if NUM_CUTPLANES > 0\nvarying vec3 vWorldPosition;\n#endif\nvoid main() {\n#include<map_vertex>\n#include<lightmap_vertex>\n#include<color_vertex>\n#include<skinbase_vertex>\n#ifdef USE_ENVMAP\n#include<morphnormal_vertex>\n#include<skinnormal_vertex>\n#include<defaultnormal_vertex>\n#endif\n#include<morphtarget_vertex>\n#include<skinning_vertex>\n#include<default_vertex>\n#include<wide_lines_vert>\n#include<logdepthbuf_vertex>\n#include<worldpos_vertex>\n#if NUM_CUTPLANES > 0\n    vec4 _worldPosition = modelMatrix * vec4( position, 1.0 );\n    vWorldPosition = _worldPosition.xyz;\n#endif\n#include<envmap_vertex>\n#include<id_vert>\n#include<point_size>\n}\n"
    },
    function(a, b) {
        a.exports = "uniform vec3 diffuse;\nuniform float opacity;\n#include<common>\n#include<color_pars_fragment>\n#include<map_pars_fragment>\n#include<alphamap_pars_fragment>\n#include<lightmap_pars_fragment>\n#include<envmap_pars_fragment>\n#include<fog_pars_fragment>\n#include<specularmap_pars_fragment>\n#include<logdepthbuf_pars_fragment>\n#if NUM_CUTPLANES > 0\nvarying highp vec3 vWorldPosition;\n#endif\n#include<cutplanes>\n#include<id_decl_frag>\n#include<theming_decl_frag>\nvoid main() {\n#if NUM_CUTPLANES > 0\n    checkCutPlanes(vWorldPosition);\n#endif\n    vec3 outgoingLight = vec3( 0.0 );\n    vec4 diffuseColor = vec4( diffuse, opacity );\n#include<logdepthbuf_fragment>\n#include<map_fragment>\n#include<color_fragment>\n#include<alphamap_fragment>\n#include<alphatest_fragment>\n#include<specularmap_fragment>\n    outgoingLight = diffuseColor.rgb;\n#include<lightmap_fragment>\n#include<envmap_fragment>\n#include<linear_to_gamma_fragment>\n#include<fog_fragment>\n    gl_FragColor = vec4( outgoingLight, diffuseColor.a );\n#include<theming_frag>\n#include<final_frag>\n}\n"
    },
    function(a, b, c) {
        "use strict";
        var d = {
            uniforms: {
                tDiffuse: {
                    type: "t",
                    value: null
                },
                tAO: {
                    type: "t",
                    value: null
                },
                useAO: {
                    type: "i",
                    value: 0
                },
                aoOpacity: {
                    type: "f",
                    value: 1
                },
                tOverlay: {
                    type: "t",
                    value: null
                },
                useOverlay: {
                    type: "i",
                    value: 0
                },
                tID: {
                    type: "t",
                    value: null
                },
                objID: {
                    type: "i",
                    value: 0
                },
                objIDv3: {
                    type: "v3",
                    value: new THREE.Vector3(0, 0, 0)
                },
                highlightIntensity: {
                    type: "f",
                    value: 1
                },
                resolution: {
                    type: "v2",
                    value: new THREE.Vector2(1 / 1024, 1 / 512)
                },
                highlightRange: {
                    type: "i",
                    value: 0
                },
                objIDStart: {
                    type: "i",
                    value: 0
                },
                objIDEnd: {
                    type: "i",
                    value: 0
                }
            },
            vertexShader: c(36),
            fragmentShader: c(37)
        };
        a.exports = d
    },
    function(a, b) {
        a.exports = "varying vec2 vUv;\r\n\r\nvoid main() {\r\n\r\n    vUv = uv;\r\n    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\r\n\r\n}\r\n"
    },
    function(a, b) {
        a.exports = "uniform sampler2D tDiffuse;\r\nuniform sampler2D tAO;\r\nuniform int useAO;\r\nuniform float aoOpacity;\r\nuniform sampler2D tOverlay;\r\nuniform int useOverlay;\r\nuniform vec2 resolution;\r\n\r\n\r\nuniform int objID;\r\nuniform vec3 objIDv3;\r\nuniform sampler2D tID;\r\nuniform float highlightIntensity;\r\n\r\nuniform int highlightRange;\r\nuniform int objIDStart;\r\nuniform int objIDEnd;\r\n\r\nvarying vec2 vUv;\r\n\r\n#include<tonemap>\r\n\r\n\r\n\r\n\r\nvec4 overlayEdgeDetect(vec2 vUv) {\r\n#define IS_SELECTION(C) ( (C).b > (C).r && (C).b > (C).g )\r\n#define CHECK_EDGE_ALPHA(I, J)     { vec4 c = texture2D( tOverlay, vUv+resolution*vec2((I),(J)) ); maxAlpha = max(maxAlpha, c.a); if (c.a > 0.0 && IS_SELECTION(c)) { hasEdge++; selectionPixel = c; } }\r\n#define CHECK_EDGE_SELECTION(I, J) { vec4 c = texture2D( tOverlay, vUv+resolution*vec2((I),(J)) ); maxAlpha = max(maxAlpha, c.a); if (c.a <= 0.0) hasEdge++; }\r\n\r\n    int hasEdge = 0;\r\n    vec4 center = texture2D(tOverlay, vUv);\r\n    vec4 selectionPixel = vec4(0.0);\r\n    float maxAlpha = 0.0;\r\n    bool paintOutline = false;\r\n\r\n    if (center.a <= 0.0) {\r\n        CHECK_EDGE_ALPHA(-1.0,-1.0);\r\n        CHECK_EDGE_ALPHA( 0.0,-1.0);\r\n        CHECK_EDGE_ALPHA( 1.0,-1.0);\r\n        CHECK_EDGE_ALPHA(-1.0, 0.0);\r\n        CHECK_EDGE_ALPHA( 1.0, 0.0);\r\n        CHECK_EDGE_ALPHA(-1.0, 1.0);\r\n        CHECK_EDGE_ALPHA( 0.0, 1.0);\r\n        CHECK_EDGE_ALPHA( 1.0, 1.0);\r\n        if (hasEdge != 0) {\r\n            center = selectionPixel;\r\n            paintOutline = true;\r\n        }\r\n    }\r\n    else if (center.a > 0.0 && IS_SELECTION(center)) {\r\n        CHECK_EDGE_SELECTION(-1.0,-1.0);\r\n        CHECK_EDGE_SELECTION( 0.0,-1.0);\r\n        CHECK_EDGE_SELECTION( 1.0,-1.0);\r\n        CHECK_EDGE_SELECTION(-1.0, 0.0);\r\n        CHECK_EDGE_SELECTION( 1.0, 0.0);\r\n        CHECK_EDGE_SELECTION(-1.0, 1.0);\r\n        CHECK_EDGE_SELECTION( 0.0, 1.0);\r\n        CHECK_EDGE_SELECTION( 1.0, 1.0);\r\n        if (hasEdge != 0)\r\n            paintOutline = true;\r\n        else\r\n            center.a = -center.a;\r\n    }\r\n\r\n\r\n    if (paintOutline) {\r\n        float maxComponent = max(center.r, max(center.g, center.b));\r\n        center.rgb /= maxComponent;\r\n        center.rgb = sqrt(center.rgb);\r\n        center.a = 0.5 + 0.5 * maxAlpha * 0.125 * float(hasEdge);\r\n    }\r\n\r\n    return center;\r\n}\r\n\r\nvec4 sampleColor() {\r\n    return texture2D( tDiffuse, vUv );\r\n}\r\n\r\nfloat sampleAO() {\r\n\r\n    return (useAO != 0) ? sqrt(texture2D(tAO, vUv).r) : 1.0;\r\n}\r\n\r\nvoid main() {\r\n\r\n    vec4 texel = sampleColor();\r\n    float ao = sampleAO();\r\n\r\n\r\n\r\n\r\n\r\n    ao = 1.0 - (1.0 - ao) * aoOpacity;\r\n    texel.rgb *= ao;\r\n\r\n\r\n\r\n    if (useOverlay != 0) {\r\n        vec4 overlay = overlayEdgeDetect(vUv);\r\n\r\n        if (overlay.a < 0.0) {\r\n            overlay.a = -overlay.a;\r\n\r\n            if (overlay.a >= 0.99) {\r\n\r\n\r\n                overlay.a = 0.75;\r\n                texel.rgb = vec3(luminance_post(texel.rgb));\r\n            }\r\n        }\r\n\r\n        texel.rgb = mix(texel.rgb, sqrt(overlay.rgb), overlay.a);\r\n    }\r\n\r\n    if (highlightRange == 0) {\r\n        if (objID != 0) {\r\n\r\n            vec4 idAtPixel = texture2D(tID, vUv);\r\n\r\n            vec3 idDelta = abs(idAtPixel.rgb - objIDv3.rgb);\r\n            if (max(max(idDelta.r, idDelta.g), idDelta.b) < 1e-3) {\r\n#ifdef IS_2D\r\n                texel.rgb = mix(texel.rgb, vec3(1.0,1.0,0.0), highlightIntensity * 0.25);\r\n#else\r\n                texel.rgb += highlightIntensity * 0.2;\r\n#endif\r\n            }\r\n\r\n        }\r\n    } else {\r\n        vec4 idAtPixel = texture2D(tID, vUv);\r\n        int dbId = int(idAtPixel.r * 255.0 + idAtPixel.g * 255.0 * 256.0 + idAtPixel.b * 255.0 * 256.0 * 256.0);\r\n        if (dbId >= objIDStart && dbId <= objIDEnd) {\r\n#ifdef IS_2D\r\n            texel.rgb = mix(texel.rgb, vec3(1.0,1.0,0.0), highlightIntensity * 0.25);\r\n#else\r\n            texel.rgb += highlightIntensity * 0.2;\r\n#endif\r\n        }\r\n    }\r\n\r\n    gl_FragColor = texel;\r\n}\r\n"
    },
    function(a, b, c) {
        "use strict";
        var d = {
            uniforms: {
                tDiffuse: {
                    type: "t",
                    value: null
                },
                tDepth: {
                    type: "t",
                    value: null
                },
                tID: {
                    type: "t",
                    value: null
                },
                resolution: {
                    type: "v2",
                    value: new THREE.Vector2(1 / 1024, 1 / 512)
                },
                cameraNear: {
                    type: "f",
                    value: 1
                },
                cameraFar: {
                    type: "f",
                    value: 100
                },
                projInfo: {
                    type: "v4",
                    value: new THREE.Vector4(0, 0, 0, 0)
                },
                isOrtho: {
                    type: "f",
                    value: 1
                }
            },
            vertexShader: c(39),
            fragmentShader: c(40)
        };
        a.exports = d
    },
    function(a, b) {
        a.exports = "varying vec2 vUv;\r\n\r\nvoid main() {\r\n\r\n    vUv = uv;\r\n    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\r\n\r\n}\r\n"
    },
    function(a, b) {
        a.exports = "#extension GL_OES_standard_derivatives : enable\r\n\r\nuniform sampler2D tDiffuse;\r\nuniform sampler2D tDepth;\r\nuniform sampler2D tID;\r\nuniform vec2 resolution;\r\nuniform float cameraNear;\r\nuniform float cameraFar;\r\n\r\n\r\nuniform float isOrtho;\r\nuniform vec4 projInfo;\r\n\r\nvarying vec2 vUv;\r\n\r\nvec4 recoverNZ(vec4 nrmz) {\r\n    float z = sqrt(1.0 - dot(nrmz.xy, nrmz.xy));\r\n    nrmz.w = -(nrmz.z +cameraNear) / (cameraFar - cameraNear);\r\n    nrmz.z = z;\r\n    return nrmz;\r\n}\r\n\r\n#include<tonemap>\r\n\r\nvec4 quantize(vec4 c) {\r\n    c *= c;\r\n\r\n    float L = max(c.x, max(c.y, c.z));\r\n    c.xyz *= floor(L * 8.0 + 0.5) / (8.0 * L);\r\n    c.w = 1.0;\r\n    return sqrt(c);\r\n}\r\n\r\nvec4 quantizeRGB(vec4 c) {\r\n    c *= c;\r\n    c.xyz *= floor(c.xyz * 8.0 + 0.5) / 8.0;\r\n    c.w = 1.0;\r\n    return sqrt(c);\r\n}\r\n\r\nvec3 reconstructCSPosition(vec2 S, float z) {\r\n    return vec3((S.xy * projInfo.xy + projInfo.zw) * mix(z, -1.0, isOrtho), z);\r\n}\r\n\r\n\r\nvec3 reconstructCSFaceNormal(vec3 C) {\r\n    return normalize(cross(dFdy(C), dFdx(C)));\r\n}\r\n\r\nvec3 getPosition(ivec2 ssP, float depth) {\r\n    vec3 P;\r\n\r\n\r\n    P = reconstructCSPosition(vec2(ssP) + vec2(0.5), depth);\r\n    return P;\r\n}\r\n\r\nint isObjectEdge() {\r\n\r\n    vec4 MM = texture2D(tID, vUv + vec2( 0.0,  0.0));\r\n\r\n    vec4 LL = texture2D(tID, vUv + vec2(-1.0, -1.0) * resolution);\r\n    if (MM != LL) return 1;\r\n\r\n    vec4 LM = texture2D(tID, vUv + vec2( 0.0, -1.0) * resolution);\r\n    if (MM != LM) return 1;\r\n\r\n    vec4 LR = texture2D(tID, vUv + vec2( 1.0, -1.0) * resolution);\r\n    if (MM != LR) return 1;\r\n\r\n    vec4 ML = texture2D(tID, vUv + vec2(-1.0,  0.0) * resolution);\r\n    if (MM != ML) return 1;\r\n\r\n    vec4 MR = texture2D(tID, vUv + vec2( 1.0,  0.0) * resolution);\r\n    if (MM != MR) return 1;\r\n\r\n    vec4 UL = texture2D(tID, vUv + vec2(-1.0,  1.0) * resolution);\r\n    if (MM != UL) return 1;\r\n\r\n    vec4 UM = texture2D(tID, vUv + vec2( 0.0,  1.0) * resolution);\r\n    if (MM != UM) return 1;\r\n\r\n    vec4 UR = texture2D(tID, vUv + vec2( 1.0,  1.0) * resolution);\r\n    if (MM != UR) return 1;\r\n\r\n    return 0;\r\n\r\n}\r\n\r\nfloat normalDiff(vec3 n1, vec3 n2) {\r\n    float d = dot(n1.xyz, n2.xyz);\r\n    return acos(clamp(d, -1.0, 1.0));\r\n}\r\n\r\nconst float r = 1.0;\r\n\r\nvoid main() {\r\n\r\n    vec4 color = texture2D(tDiffuse, vUv);\r\n\r\n    ivec2 ssC = ivec2(gl_FragCoord.xy);\r\n\r\n    if (isObjectEdge() == 1) {\r\n        gl_FragColor = vec4(0,0,0,1);\r\n        return;\r\n    }\r\n\r\n\r\n    vec4 MM = texture2D(tDepth, vUv + vec2( 0.0,  0.0));\r\n\r\n\r\n\r\n    if (MM.z == 0.0) {\r\n        gl_FragColor = quantize(color);\r\n        return;\r\n    }\r\n\r\n    vec4 LL = texture2D(tDepth, vUv + vec2(-r, -r) * resolution);\r\n    vec4 LM = texture2D(tDepth, vUv + vec2( 0.0, -r) * resolution);\r\n    vec4 LR = texture2D(tDepth, vUv + vec2( r, -r) * resolution);\r\n\r\n    vec4 ML = texture2D(tDepth, vUv + vec2(-r,  0.0) * resolution);\r\n    vec4 MR = texture2D(tDepth, vUv + vec2( r,  0.0) * resolution);\r\n\r\n    vec4 UL = texture2D(tDepth, vUv + vec2(-r, r) * resolution);\r\n    vec4 UM = texture2D(tDepth, vUv + vec2( 0.0,  r) * resolution);\r\n    vec4 UR = texture2D(tDepth, vUv + vec2( r,  r) * resolution);\r\n\r\n    vec3 C = getPosition(ssC + ivec2(-1, -1), LL.z);\r\n    vec3 LLz = reconstructCSFaceNormal(C);\r\n    C = getPosition(ssC + ivec2( 0, -1), LM.z);\r\n    vec3 LMz = reconstructCSFaceNormal(C);\r\n    C = getPosition(ssC + ivec2( 1, -1), LR.z);\r\n    vec3 LRz = reconstructCSFaceNormal(C);\r\n\r\n    C = getPosition(ssC + ivec2(-1, 0), ML.z);\r\n    vec3 MLz = reconstructCSFaceNormal(C);\r\n    C = getPosition(ssC + ivec2( 0, 0), MM.z);\r\n    vec3 MMz = reconstructCSFaceNormal(C);\r\n    C = getPosition(ssC + ivec2( 1, 0), MR.z);\r\n    vec3 MRz = reconstructCSFaceNormal(C);\r\n\r\n    C = getPosition(ssC + ivec2(-1, 1), UL.z);\r\n    vec3 ULz = reconstructCSFaceNormal(C);\r\n    C = getPosition(ssC + ivec2(0, 1), UM.z);\r\n    vec3 UMz = reconstructCSFaceNormal(C);\r\n    C = getPosition(ssC + ivec2(1, 1), UR.z);\r\n    vec3 URz = reconstructCSFaceNormal(C);\r\n\r\n\r\n    LL = recoverNZ(LL);\r\n    LM = recoverNZ(LM);\r\n    LR = recoverNZ(LR);\r\n\r\n    ML = recoverNZ(ML);\r\n    MM = recoverNZ(MM);\r\n    MR = recoverNZ(MR);\r\n\r\n    UL = recoverNZ(UL);\r\n    UM = recoverNZ(UM);\r\n    UR = recoverNZ(UR);\r\n\r\n\r\n    float pLL = normalDiff(LL.xyz, MM.xyz);\r\n    float pLM = normalDiff(LM.xyz, MM.xyz);\r\n    float pLR = normalDiff(LR.xyz, MM.xyz);\r\n\r\n    float pML = normalDiff(ML.xyz, MM.xyz);\r\n    float pMM = normalDiff(MM.xyz, MM.xyz);\r\n    float pMR = normalDiff(MR.xyz, MM.xyz);\r\n\r\n    float pUL = normalDiff(UL.xyz, MM.xyz);\r\n    float pUM = normalDiff(UM.xyz, MM.xyz);\r\n    float pUR = normalDiff(UR.xyz, MM.xyz);\r\n\r\n\r\n\r\n\r\n    float pLLz = normalDiff(LLz.xyz, MMz.xyz);\r\n    float pLMz = normalDiff(LMz.xyz, MMz.xyz);\r\n    float pLRz = normalDiff(LRz.xyz, MMz.xyz);\r\n\r\n    float pMLz = normalDiff(MLz.xyz, MMz.xyz);\r\n    float pMMz = normalDiff(MMz.xyz, MMz.xyz);\r\n    float pMRz = normalDiff(MRz.xyz, MMz.xyz);\r\n\r\n    float pULz = normalDiff(ULz.xyz, MMz.xyz);\r\n    float pUMz = normalDiff(UMz.xyz, MMz.xyz);\r\n    float pURz = normalDiff(URz.xyz, MMz.xyz);\r\n\r\n\r\n\r\n\r\n\r\n    float dGx = (dFdx(UL.w) + 2.0 * dFdx(UM.w) + dFdx(UR.w)) - (dFdx(LL.w) + 2.0 * dFdx(LM.w) + dFdx(LR.w)) + (dFdx(UR.w) + 2.0 * dFdx(MR.w) - dFdx(LR.w)) - (dFdx(UL.w) + 2.0 * dFdx(ML.w) - dFdx(LL.w));\r\n    float dGy = (dFdy(UL.w) + 2.0 * dFdy(UM.w) + dFdy(UR.w)) - (dFdy(LL.w) + 2.0 * dFdy(LM.w) + dFdy(LR.w)) + (dFdy(UR.w) + 2.0 * dFdy(MR.w) - dFdy(LR.w)) - (dFdy(UL.w) + 2.0 * dFdy(ML.w) - dFdy(LL.w));\r\n\r\n\r\n    float Gn = (abs(pUL - pMM) + 2.0 * abs(pUM - pMM) + abs(pUR - pMM) + 2.0 * abs(pML - pMM) + 2.0 * abs(pMR - pMM) + abs(pLL - pMM) + 2.0 * abs(pLM - pMM) + abs(pLR - pMM));\r\n    float Gnz = (abs(pULz - pMMz) + 2.0 * abs(pUMz - pMMz) + abs(pURz - pMMz) + 2.0 * abs(pMLz - pMMz) + 2.0 * abs(pMRz - pMMz) + abs(pLLz - pMMz) + 2.0 * abs(pLMz - pMMz) + abs(pLRz - pMMz));\r\n    float G = (abs(UL.w - MM.w) + 2.0 * abs(UM.w - MM.w) + abs(UR.w - MM.w) + 2.0 * abs(ML.w - MM.w) + 2.0 * abs(MR.w - MM.w) + abs(LL.w - MM.w) + 2.0 * abs(LM.w - MM.w) + abs(LR.w - MM.w));\r\n\r\n    float dd = abs(dFdx(G)) + abs(dFdy(G));\r\n\r\n\r\n    if (dd > 0.004 || abs(Gnz) > 2.2 || abs(Gn) > 2.0)\r\n        gl_FragColor = vec4(0.0,0.0,0.0,1.0);\r\n    else\r\n        gl_FragColor =quantize(color);\r\n\r\n}\r\n"
    },
    function(a, b, c) {
        "use strict";
        var d = {
            uniforms: {
                tDiffuse: {
                    type: "t",
                    value: null
                }
            },
            vertexShader: c(42),
            fragmentShader: c(43)
        };
        a.exports = d
    },
    function(a, b) {
        a.exports = "varying vec2 vUv;\nvoid main() {\n    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n    vUv = uv;\n}\n"
    },
    function(a, b) {
        a.exports = "uniform sampler2D tDiffuse;\nvarying vec2 vUv;\nvoid main() {\n    gl_FragColor = texture2D(tDiffuse, vUv);\n}\n"
    },
    function(a, b, c) {
        "use strict";
        var d = {
            uniforms: {
                tDiffuse: {
                    type: "t",
                    value: null
                },
                uResolution: {
                    type: "v2",
                    value: new THREE.Vector2(1 / 1024, 1 / 512)
                }
            },
            vertexShader: c(45),
            fragmentShader: c(46)
        };
        a.exports = d
    },
    function(a, b) {
        a.exports = "uniform vec2 uResolution;\nvarying vec2 vPos;\nvarying vec4 vPosPos;\nvoid main() {\n    vPos = uv;\n    vPosPos.xy = uv + vec2(-0.5, -0.5) * uResolution;\n    vPosPos.zw = uv + vec2( 0.5,  0.5) * uResolution;\n    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}\n"
    },
    function(a, b) {
        a.exports = "#define FXAA_EDGE_SHARPNESS (8.0)\n#define FXAA_EDGE_THRESHOLD (0.125)\n#define FXAA_EDGE_THRESHOLD_MIN (0.05)\n#define FXAA_RCP_FRAME_OPT (0.50)\n#define FXAA_RCP_FRAME_OPT2 (2.0)\nuniform sampler2D tDiffuse;\nuniform highp vec2 uResolution;\nvarying vec2 vPos;\nvarying vec4 vPosPos;\nfloat FxaaLuma(vec3 rgb) {\n    return dot(rgb, vec3(0.299, 0.587, 0.114));\n}\nvoid main() {\n    float lumaNw = FxaaLuma(texture2D(tDiffuse, vPosPos.xy).rgb);\n    float lumaSw = FxaaLuma(texture2D(tDiffuse, vPosPos.xw).rgb);\n    float lumaNe = FxaaLuma(texture2D(tDiffuse, vPosPos.zy).rgb) + 1.0/384.0;\n    float lumaSe = FxaaLuma(texture2D(tDiffuse, vPosPos.zw).rgb);\n    vec3 rgbM = texture2D(tDiffuse, vPos.xy).rgb;\n    float lumaM = FxaaLuma(rgbM.rgb);\n    float lumaMax = max(max(lumaNe, lumaSe), max(lumaNw, lumaSw));\n    float lumaMin = min(min(lumaNe, lumaSe), min(lumaNw, lumaSw));\n    float lumaMaxSubMinM = max(lumaMax, lumaM) - min(lumaMin, lumaM);\n    float lumaMaxScaledClamped = max(FXAA_EDGE_THRESHOLD_MIN, lumaMax * FXAA_EDGE_THRESHOLD);\n    if (lumaMaxSubMinM < lumaMaxScaledClamped) {\n        gl_FragColor = vec4(rgbM, 1.0);\n        return;\n    }\n    float dirSwMinusNe = lumaSw - lumaNe;\n    float dirSeMinusNw = lumaSe - lumaNw;\n    vec2 dir1 = normalize(vec2(dirSwMinusNe + dirSeMinusNw, dirSwMinusNe - dirSeMinusNw));\n    vec3 rgbN1 = texture2D(tDiffuse, vPos.xy - dir1 * FXAA_RCP_FRAME_OPT*uResolution).rgb;\n    vec3 rgbP1 = texture2D(tDiffuse, vPos.xy + dir1 * FXAA_RCP_FRAME_OPT*uResolution).rgb;\n    float dirAbsMinTimesC = min(abs(dir1.x), abs(dir1.y)) * FXAA_EDGE_SHARPNESS;\n    vec2 dir2 = clamp(dir1.xy / dirAbsMinTimesC, -2.0, 2.0);\n    vec3 rgbN2 = texture2D(tDiffuse, vPos.xy - dir2 * FXAA_RCP_FRAME_OPT2*uResolution).rgb;\n    vec3 rgbP2 = texture2D(tDiffuse, vPos.xy + dir2 * FXAA_RCP_FRAME_OPT2*uResolution).rgb;\n    vec3 rgbA = rgbN1 + rgbP1;\n    vec3 rgbB = ((rgbN2 + rgbP2) * 0.25) + (rgbA * 0.25);\n    float lumaB = FxaaLuma(rgbB);\n    if ((lumaB < lumaMin) || (lumaB > lumaMax))\n        gl_FragColor = vec4(rgbA * 0.5, 1.0);\n    else\n        gl_FragColor = vec4(rgbB, 1.0);\n}\n"
    },
    function(a, b, c) {
        "use strict";
        var d = {
            uniforms: {
                tDiffuse: {
                    type: "t",
                    value: null
                },
                size: {
                    type: "v2",
                    value: new THREE.Vector2(512, 512)
                },
                resolution: {
                    type: "v2",
                    value: new THREE.Vector2(1 / 512, 1 / 512)
                },
                axis: {
                    type: "v2",
                    value: new THREE.Vector2(1, 0)
                },
                radius: {
                    type: "f",
                    value: 50
                }
            },
            vertexShader: c(48),
            fragmentShader: c(49)
        };
        a.exports = d
    },
    function(a, b) {
        a.exports = "varying vec2 vUv;\nvoid main() {\n    vUv = uv;\n    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}\n"
    },
    function(a, b) {
        a.exports = "\n#define EDGE_SHARPNESS     (3.0)\n#define SCALE               (2)\n#define R                   (4)\n#define VALUE_TYPE        float\n#define VALUE_COMPONENTS   r\n#define VALUE_IS_KEY       0\n#define KEY_COMPONENTS     gb\n#if __VERSION__ >= 330\nconst float gaussian[R + 1] =\nfloat[](0.153170, 0.144893, 0.122649, 0.092902, 0.062970);\n#endif\nuniform sampler2D   tDiffuse;\nuniform vec2 size;\nuniform vec2 resolution;\nuniform vec2       axis;\nuniform float radius;\n#define  result         gl_FragColor.VALUE_COMPONENTS\n#define  keyPassThrough gl_FragColor.KEY_COMPONENTS\nfloat unpackKey(vec2 p) {\n    return p.x * (256.0 / 257.0) + p.y * (1.0 / 257.0);\n}\nvarying vec2 vUv;\nvoid main() {\n#   if __VERSION__ < 330\n    float gaussian[R + 1];\n#       if R == 3\n    gaussian[0] = 0.153170; gaussian[1] = 0.144893; gaussian[2] = 0.122649; gaussian[3] = 0.092902;\n#       elif R == 4\n    gaussian[0] = 0.153170; gaussian[1] = 0.144893; gaussian[2] = 0.122649; gaussian[3] = 0.092902; gaussian[4] = 0.062970;\n#       elif R == 6\n    gaussian[0] = 0.111220; gaussian[1] = 0.107798; gaussian[2] = 0.098151; gaussian[3] = 0.083953; gaussian[4] = 0.067458; gaussian[5] = 0.050920; gaussian[6] = 0.036108;\n#       endif\n#   endif\n    ivec2 axisi = ivec2(axis);\n    ivec2 ssC = ivec2(gl_FragCoord.xy);\n    vec4 temp = texture2D(tDiffuse, vUv);\n    gl_FragColor.gb = temp.KEY_COMPONENTS;\n    gl_FragColor.a = temp.a;\n    VALUE_TYPE sum = temp.VALUE_COMPONENTS;\n    if (temp.a == 0.0) {\n        result = sum;\n        return;\n    }\n    float key = unpackKey(keyPassThrough);\n    float BASE = gaussian[0];\n    float totalWeight = BASE;\n    sum *= totalWeight;\n    float scale = 1.5 / radius;\n    int r = -4; {\n        vec2 ssUV = vec2(ssC + axisi * (r * SCALE))*resolution;\n        temp = texture2D(tDiffuse, ssUV);\n        float      tapKey = unpackKey(temp.KEY_COMPONENTS);\n        VALUE_TYPE value  = temp.VALUE_COMPONENTS;\n        float weight = 0.3 + gaussian[4];\n        float dz = tapKey - key;\n        weight *= max(0.0, 1.0 - (EDGE_SHARPNESS * 2000.0) * abs(dz) * scale);\n        sum += value * weight;\n        totalWeight += weight;\n    }\n    r = -3; {\n        vec2 ssUV = vec2(ssC + axisi * (r * SCALE))*resolution;\n        temp = texture2D(tDiffuse, ssUV);\n        float      tapKey = unpackKey(temp.KEY_COMPONENTS);\n        VALUE_TYPE value  = temp.VALUE_COMPONENTS;\n        float weight = 0.3 + gaussian[3];\n        float dz = tapKey - key;\n        weight *= max(0.0, 1.0 - (EDGE_SHARPNESS * 2000.0) * abs(dz) * scale);\n        sum += value * weight;\n        totalWeight += weight;\n    }\n    r = -2; {\n        vec2 ssUV = vec2(ssC + axisi * (r * SCALE))*resolution;\n        temp = texture2D(tDiffuse, ssUV);\n        float      tapKey = unpackKey(temp.KEY_COMPONENTS);\n        VALUE_TYPE value  = temp.VALUE_COMPONENTS;\n        float weight = 0.3 + gaussian[2];\n        float dz = tapKey - key;\n        weight *= max(0.0, 1.0 - (EDGE_SHARPNESS * 2000.0) * abs(dz) * scale);\n        sum += value * weight;\n        totalWeight += weight;\n    }\n    r=-1; {\n        vec2 ssUV = vec2(ssC + axisi * (r * SCALE))*resolution;\n        temp = texture2D(tDiffuse, ssUV);\n        float      tapKey = unpackKey(temp.KEY_COMPONENTS);\n        VALUE_TYPE value  = temp.VALUE_COMPONENTS;\n        float weight = 0.3 + gaussian[1];\n        float dz = tapKey - key;\n        weight *= max(0.0, 1.0 - (EDGE_SHARPNESS * 2000.0) * abs(dz) * scale);\n        sum += value * weight;\n        totalWeight += weight;\n    }\n    r = 1; {\n        vec2 ssUV = vec2(ssC + axisi * (r * SCALE))*resolution;\n        temp = texture2D(tDiffuse, ssUV);\n        float      tapKey = unpackKey(temp.KEY_COMPONENTS);\n        VALUE_TYPE value  = temp.VALUE_COMPONENTS;\n        float weight = 0.3 + gaussian[1];\n        float dz = tapKey - key;\n        weight *= max(0.0, 1.0 - (EDGE_SHARPNESS * 2000.0) * abs(dz) * scale);\n        sum += value * weight;\n        totalWeight += weight;\n    }\n    r = 2; {\n        vec2 ssUV = vec2(ssC + axisi * (r * SCALE))*resolution;\n        temp = texture2D(tDiffuse, ssUV);\n        float      tapKey = unpackKey(temp.KEY_COMPONENTS);\n        VALUE_TYPE value  = temp.VALUE_COMPONENTS;\n        float weight = 0.3 + gaussian[2];\n        float dz = tapKey - key;\n        weight *= max(0.0, 1.0 - (EDGE_SHARPNESS * 2000.0) * abs(dz) * scale);\n        sum += value * weight;\n        totalWeight += weight;\n    }\n    r = 3; {\n        vec2 ssUV = vec2(ssC + axisi * (r * SCALE))*resolution;\n        temp = texture2D(tDiffuse, ssUV);\n        float      tapKey = unpackKey(temp.KEY_COMPONENTS);\n        VALUE_TYPE value  = temp.VALUE_COMPONENTS;\n        float weight = 0.3 + gaussian[3];\n        float dz = tapKey - key;\n        weight *= max(0.0, 1.0 - (EDGE_SHARPNESS * 2000.0) * abs(dz) * scale);\n        sum += value * weight;\n        totalWeight += weight;\n    }\n    r = 4; {\n        vec2 ssUV = vec2(ssC + axisi * (r * SCALE))*resolution;\n        temp = texture2D(tDiffuse, ssUV);\n        float      tapKey = unpackKey(temp.KEY_COMPONENTS);\n        VALUE_TYPE value  = temp.VALUE_COMPONENTS;\n        float weight = 0.3 + gaussian[4];\n        float dz = tapKey - key;\n        weight *= max(0.0, 1.0 - (EDGE_SHARPNESS * 2000.0) * abs(dz) * scale);\n        sum += value * weight;\n        totalWeight += weight;\n    }\n    const float epsilon = 0.0001;\n    result = sum / (totalWeight + epsilon);\n}\n"
    },
    function(a, b, c) {
        "use strict";
        var d = {
            uniforms: {
                tDepth: {
                    type: "t",
                    value: null
                },
                size: {
                    type: "v2",
                    value: new THREE.Vector2(512, 512)
                },
                resolution: {
                    type: "v2",
                    value: new THREE.Vector2(1 / 512, 1 / 512)
                },
                cameraNear: {
                    type: "f",
                    value: 1
                },
                cameraFar: {
                    type: "f",
                    value: 100
                },
                radius: {
                    type: "f",
                    value: 10
                },
                bias: {
                    type: "f",
                    value: .1
                },
                projScale: {
                    type: "f",
                    value: 500
                },
                projInfo: {
                    type: "v4",
                    value: new THREE.Vector4(0, 0, 0, 0)
                },
                intensity: {
                    type: "f",
                    value: .4
                },
                isOrtho: {
                    type: "f",
                    value: 1
                },
                tDepth_mip1: {
                    type: "t",
                    value: null
                },
                tDepth_mip2: {
                    type: "t",
                    value: null
                },
                tDepth_mip3: {
                    type: "t",
                    value: null
                },
                tDepth_mip4: {
                    type: "t",
                    value: null
                },
                tDepth_mip5: {
                    type: "t",
                    value: null
                }
            },
            vertexShader: c(51),
            fragmentShader: c(52)
        };
        a.exports = d
    },
    function(a, b) {
        a.exports = "varying vec2 vUv;\r\n\r\nvoid main() {\r\n\r\n    vUv = uv;\r\n\r\n    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\r\n\r\n}\r\n"
    },
    function(a, b) {
        a.exports = "#define USE_MIPMAP 1\r\n\r\nuniform float cameraNear;\r\nuniform float cameraFar;\r\n\r\n\r\nuniform vec2 size;\r\nuniform vec2 resolution;\r\n\r\nuniform float lumInfluence;\r\n\r\nvarying vec2 vUv;\r\n\r\n\r\n#define NUM_SAMPLES (17)\r\n\r\n\r\n\r\n\r\n\r\n#define LOG_MAX_OFFSET (3)\r\n\r\n\r\n#define MAX_MIP_LEVEL (5)\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n#define NUM_SPIRAL_TURNS (5)\r\n\r\n#define MIN_RADIUS (3.0)\r\n\r\n\r\n\r\n\r\nuniform float           projScale;\r\n\r\n\r\nuniform sampler2D tDepth;\r\n\r\n\r\n\r\n\r\n#ifdef USE_MIPMAP\r\nuniform sampler2D tDepth_mip1;\r\nuniform sampler2D tDepth_mip2;\r\nuniform sampler2D tDepth_mip3;\r\nuniform sampler2D tDepth_mip4;\r\nuniform sampler2D tDepth_mip5;\r\n#endif\r\n\r\n\r\nuniform float radius;\r\n\r\n\r\nuniform float bias;\r\n\r\nuniform float intensity;\r\n\r\nuniform float isOrtho;\r\n\r\n\r\n\r\n\r\n\r\n\r\nvec2 tapLocation(int sampleNumber, float spinAngle, out float ssR){\r\n\r\n    float alpha = float(float(sampleNumber) + 0.5) * (1.0 / float(NUM_SAMPLES));\r\n    float angle = alpha * (float(NUM_SPIRAL_TURNS) * 6.28) + spinAngle;\r\n\r\n    ssR = alpha;\r\n    return vec2(cos(angle), sin(angle));\r\n}\r\n\r\n\r\n\r\nfloat CSZToKey(float z) {\r\n\r\n\r\n\r\n    return clamp( (z+cameraNear) / (cameraNear-cameraFar), 0.0, 1.0);\r\n}\r\n\r\n\r\n\r\nvoid packKey(float key, out vec2 p) {\r\n\r\n    float temp = floor(key * 256.0);\r\n\r\n\r\n    p.x = temp * (1.0 / 256.0);\r\n\r\n\r\n    p.y = key * 256.0 - temp;\r\n}\r\n\r\n#include<pack_depth>\r\n\r\n\r\nfloat unpackDepthNearFar( const in vec4 rgba_depth ) {\r\n    float depth = unpackDepth( rgba_depth );\r\n    if (depth == 0.0)\r\n        return -cameraFar * 1.0e10;\r\n    return depth * (cameraNear - cameraFar) - cameraNear;\r\n}\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\nuniform vec4 projInfo;\r\n\r\n\r\nvec3 reconstructCSPosition(vec2 S, float z) {\r\n    return vec3((S.xy * projInfo.xy + projInfo.zw) * mix(z, -1.0, isOrtho), z);\r\n}\r\n\r\n\r\nvec3 reconstructCSFaceNormal(vec3 C) {\r\n    return normalize(cross(dFdy(C), dFdx(C)));\r\n}\r\n\r\nvec3 reconstructNonUnitCSFaceNormal(vec3 C) {\r\n    return cross(dFdy(C), dFdx(C));\r\n}\r\n\r\n\r\nvec3 getPosition(ivec2 ssP, float depth) {\r\n    vec3 P;\r\n\r\n\r\n    P = reconstructCSPosition(vec2(ssP) + vec2(0.5), depth);\r\n    return P;\r\n}\r\n\r\n\r\nvec3 getOffsetPosition(ivec2 ssC, vec2 unitOffset, float ssR) {\r\n\r\n    ivec2 ssP = ivec2(ssR * unitOffset) + ssC;\r\n\r\n    vec3 P;\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n    vec2 screenUV = (vec2(ssP) + vec2(0.5)) * resolution;\r\n\r\n#ifdef USE_MIPMAP\r\n\r\n    int mipLevel = int(max(0.0, min(floor(log2(ssR)) - float(LOG_MAX_OFFSET), float(MAX_MIP_LEVEL))));\r\n\r\n    if (mipLevel == 0) {\r\n        P.z = texture2D(tDepth, screenUV).z;\r\n        if (P.z == 0.0) P.z = -cameraFar * 1.0e10;\r\n    }\r\n    else if (mipLevel == 1)\r\n        P.z = unpackDepthNearFar(texture2D(tDepth_mip1, screenUV));\r\n    else if (mipLevel == 2)\r\n        P.z = unpackDepthNearFar(texture2D(tDepth_mip2, screenUV));\r\n    else if (mipLevel == 3)\r\n        P.z = unpackDepthNearFar(texture2D(tDepth_mip3, screenUV));\r\n    else if (mipLevel == 4)\r\n        P.z = unpackDepthNearFar(texture2D(tDepth_mip4, screenUV));\r\n    else if (mipLevel == 5)\r\n        P.z = unpackDepthNearFar(texture2D(tDepth_mip5, screenUV));\r\n#else\r\n    P.z = texture2D(tDepth, screenUV).z;\r\n    if (P.z == 0.0) P.z = -cameraFar * 1.0e10;\r\n#endif\r\n\r\n\r\n    P = reconstructCSPosition(vec2(ssP) + vec2(0.5), P.z);\r\n\r\n    return P;\r\n}\r\n\r\n\r\nfloat sampleAO(in ivec2 ssC, in vec3 C, in vec3 n_C, in float ssDiskRadius, in int tapIndex, in float randomPatternRotationAngle) {\r\n\r\n    float ssR;\r\n    vec2 unitOffset = tapLocation(tapIndex, randomPatternRotationAngle, ssR);\r\n\r\n\r\n    ssR = max(0.75, ssR * ssDiskRadius);\r\n\r\n\r\n    vec3 Q = getOffsetPosition(ssC, unitOffset, ssR);\r\n\r\n\r\n    vec3 v = Q - C;\r\n\r\n    float vv = dot(v, v);\r\n    float vn = dot(v, n_C);\r\n\r\n    const float epsilon = 0.001;\r\n\r\n\r\n    float angAdjust = mix(1.0, max(0.0, 1.5 * n_C.z), 0.35);\r\n\r\n\r\n\r\n#define HIGH_QUALITY\r\n\r\n\r\n\r\n\r\n\r\n#ifdef HIGH_QUALITY\r\n\r\n\r\n\r\n    float f = max(1.0 - vv / (radius * radius), 0.0); return angAdjust * f * max((vn - bias) / sqrt(epsilon + vv), 0.0);\r\n#else\r\n\r\n\r\n    float f = max(radius * radius - vv, 0.0); return angAdjust * f * f * f * max((vn - bias) / (epsilon + vv), 0.0);\r\n#endif\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n}\r\n\r\n\r\n\r\n\r\nconst bool useNoise = true;\r\n\r\n\r\n\r\nfloat getRandomAngle(vec2 pos) {\r\n\r\n    float dt= dot(pos ,vec2(12.9898,78.233));\r\n    return 6.28318 * fract(sin(mod(dt,3.14)) * 43758.5453);\r\n}\r\n\r\n\r\nvoid main() {\r\n\r\n\r\n    ivec2 ssC = ivec2(gl_FragCoord.xy);\r\n\r\n\r\n    vec4 nrmz = texture2D(tDepth, vUv);\r\n\r\n\r\n    if (nrmz.z == 0.0) {\r\n\r\n        gl_FragColor.r = 1.0;\r\n        gl_FragColor.a = 0.0;\r\n        packKey(1.0, gl_FragColor.gb);\r\n        return;\r\n    }\r\n\r\n\r\n    vec3 C = getPosition(ssC, nrmz.z);\r\n\r\n    packKey(CSZToKey(C.z), gl_FragColor.gb);\r\n\r\n\r\n\r\n\r\n    float ssDiskRadius = -projScale * radius / mix(C.z, -1.0, isOrtho);\r\n\r\n    float A;\r\n    if (ssDiskRadius <= MIN_RADIUS) {\r\n\r\n        A = 1.0;\r\n    } else {\r\n\r\n        float sum = 0.0;\r\n\r\n\r\n\r\n\r\n\r\n\r\n        float randomPatternRotationAngle = getRandomAngle(vUv);\r\n\r\n\r\n\r\n\r\n\r\n        vec3 n_C = vec3(nrmz.x, nrmz.y, sqrt(1.0 - dot(nrmz.xy, nrmz.xy)));\r\n\r\n\r\n\r\n\r\n\r\n\r\n        sum += sampleAO(ssC, C, n_C, ssDiskRadius, 0, randomPatternRotationAngle);\r\n        sum += sampleAO(ssC, C, n_C, ssDiskRadius, 1, randomPatternRotationAngle);\r\n        sum += sampleAO(ssC, C, n_C, ssDiskRadius, 2, randomPatternRotationAngle);\r\n        sum += sampleAO(ssC, C, n_C, ssDiskRadius, 3, randomPatternRotationAngle);\r\n        sum += sampleAO(ssC, C, n_C, ssDiskRadius, 4, randomPatternRotationAngle);\r\n        sum += sampleAO(ssC, C, n_C, ssDiskRadius, 5, randomPatternRotationAngle);\r\n        sum += sampleAO(ssC, C, n_C, ssDiskRadius, 6, randomPatternRotationAngle);\r\n        sum += sampleAO(ssC, C, n_C, ssDiskRadius, 7, randomPatternRotationAngle);\r\n        sum += sampleAO(ssC, C, n_C, ssDiskRadius, 8, randomPatternRotationAngle);\r\n        sum += sampleAO(ssC, C, n_C, ssDiskRadius, 9, randomPatternRotationAngle);\r\n        sum += sampleAO(ssC, C, n_C, ssDiskRadius, 10, randomPatternRotationAngle);\r\n        sum += sampleAO(ssC, C, n_C, ssDiskRadius, 11, randomPatternRotationAngle);\r\n        sum += sampleAO(ssC, C, n_C, ssDiskRadius, 12, randomPatternRotationAngle);\r\n        sum += sampleAO(ssC, C, n_C, ssDiskRadius, 13, randomPatternRotationAngle);\r\n        sum += sampleAO(ssC, C, n_C, ssDiskRadius, 14, randomPatternRotationAngle);\r\n        sum += sampleAO(ssC, C, n_C, ssDiskRadius, 15, randomPatternRotationAngle);\r\n        sum += sampleAO(ssC, C, n_C, ssDiskRadius, 16, randomPatternRotationAngle);\r\n\r\n        float intensityDivR6 = intensity / pow(radius, 6.0);\r\n\r\n#ifdef HIGH_QUALITY\r\n        A = pow(max(0.0, 1.0 - sqrt(sum * (3.0 / float(NUM_SAMPLES)))), intensity);\r\n\r\n#else\r\n\r\n        A = max(0.0, 1.0 - sum * intensityDivR6 * (5.0 / float(NUM_SAMPLES)));\r\n\r\n\r\n\r\n        A = (pow(A, 0.2) + 1.2 * A*A*A*A) / 2.2;\r\n#endif\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n        if (abs(dFdx(C.z)) < 0.02) {\r\n            A -= dFdx(A) * (mod(float(ssC.x), 2.0) - 0.5);\r\n        }\r\n        if (abs(dFdy(C.z)) < 0.02) {\r\n            A -= dFdy(A) * (mod(float(ssC.y), 2.0) - 0.5);\r\n        }\r\n\r\n\r\n        A = mix(1.0, A, clamp(ssDiskRadius - MIN_RADIUS,0.0,1.0));\r\n    }\r\n\r\n    gl_FragColor.r = A;\r\n    gl_FragColor.a = 1.0;\r\n\r\n\r\n\r\n\r\n\r\n\r\n}\r\n"
    },
    function(a, b, c) {
        "use strict";
        var d = {
            uniforms: {
                cutplanes: {
                    type: "v4v",
                    value: []
                }
            },
            vertexShader: c(54),
            fragmentShader: c(55)
        };
        a.exports = d
    },
    function(a, b) {
        a.exports = "varying vec3 vNormal;\r\nvarying float depth;\r\n\r\n#if NUM_CUTPLANES > 0\r\nvarying vec3 vWorldPosition;\r\n#endif\r\n\r\n#include<pack_normals>\r\n#include<instancing_decl_vert>\r\n\r\nvoid main() {\r\n\r\n#ifdef UNPACK_NORMALS\r\n    vec3 objectNormal = decodeNormal(normal);\r\n#else\r\n    vec3 objectNormal = normal;\r\n#endif\r\n\r\n#ifdef FLIP_SIDED\r\n    objectNormal = -objectNormal;\r\n#endif\r\n\r\n\r\n    objectNormal = getInstanceNormal(objectNormal);\r\n    vec3 instPos = getInstancePos(position);\r\n\r\n    vec3 transformedNormal = normalMatrix * objectNormal;\r\n\r\n    vNormal = normalize( transformedNormal );\r\n\r\n#if NUM_CUTPLANES > 0\r\n    vec4 worldPosition = modelMatrix * vec4( instPos, 1.0 );\r\n    vWorldPosition = worldPosition.xyz;\r\n\r\n#endif\r\n\r\n    vec4 mvPosition = modelViewMatrix * vec4( instPos, 1.0 );\r\n    depth = mvPosition.z;\r\n\r\n    vec4 p_Position = projectionMatrix * mvPosition;\r\n    gl_Position = p_Position;\r\n}\r\n"
    },
    function(a, b) {
        a.exports = "varying highp vec3 vNormal;\r\nvarying highp float depth;\r\n\r\n#if NUM_CUTPLANES > 0\r\nvarying vec3 vWorldPosition;\r\n#endif\r\n#include<cutplanes>\r\n\r\nvoid main() {\r\n#if NUM_CUTPLANES > 0\r\n    checkCutPlanes(vWorldPosition);\r\n#endif\r\n\r\n    vec3 n = vNormal;\r\n\r\n\r\n    n = n * ( -1.0 + 2.0 * float( gl_FrontFacing ) );\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n    n = normalize( n );\r\n\r\n\r\n\r\n\r\n\r\n\r\n    gl_FragColor = vec4(n.x, n.y, depth, 1.0);\r\n}\r\n"
    },
    function(a, b, c) {
        "use strict";
        var d = {
            uniforms: {
                color: {
                    type: "v4",
                    value: new THREE.Vector4(0, 0, 0, .3)
                },
                cutplanes: {
                    type: "v4v",
                    value: []
                }
            },
            vertexShader: c(57),
            fragmentShader: c(58)
        };
        a.exports = d
    },
    function(a, b) {
        a.exports = "\n#if NUM_CUTPLANES > 0\nvarying vec3 vWorldPosition;\n#endif\n#include<instancing_decl_vert>\nvoid main() {\n    vec3 instPos = getInstancePos(position);\n#if NUM_CUTPLANES > 0\n    vec4 worldPosition = modelMatrix * vec4( instPos, 1.0 );\n    vWorldPosition = worldPosition.xyz;\n#endif\n    vec4 mvPosition = modelViewMatrix * vec4( instPos, 1.0 );\n    vec4 p_Position = projectionMatrix * mvPosition;\n    gl_Position = p_Position;\n}"
    },
    function(a, b) {
        a.exports = "\n#if NUM_CUTPLANES > 0\nvarying vec3 vWorldPosition;\n#endif\n#include<cutplanes>\nuniform vec4 color;\nvoid main() {\n#if NUM_CUTPLANES > 0\n    checkCutPlanes(vWorldPosition);\n#endif\n    gl_FragColor = color;\n}"
    },
    function(a, b, c) {
        "use strict";
        var d = {
            uniforms: {
                pixelsPerUnit: {
                    type: "f",
                    value: 1
                },
                aaRange: {
                    type: "f",
                    value: .5
                },
                tLayerMask: {
                    type: "t",
                    value: null
                },
                tLineStyle: {
                    type: "t",
                    value: null
                },
                vLineStyleTexSize: {
                    type: "v2",
                    value: new THREE.Vector2(13, 70)
                },
                tRaster: {
                    type: "t",
                    value: null
                },
                tSelectionTexture: {
                    type: "t",
                    value: null
                },
                vSelTexSize: {
                    type: "v2",
                    value: new THREE.Vector2(4096, 1)
                },
                displayPixelRatio: {
                    type: "f",
                    value: 1
                },
                opacity: {
                    type: "f",
                    value: 1
                },
                selectionColor: {
                    type: "v4",
                    value: new THREE.Vector4(0, 0, 1, 1)
                },
                modelId: {
                    type: "v3",
                    value: new THREE.Vector3(0, 0, 0)
                },
                viewportId: {
                    type: "f",
                    value: 0
                },
                swap: {
                    type: "f",
                    value: 0
                }
            },
            attributes: {
                fields1: 0,
                fields2: 0,
                color4b: 0,
                dbId4b: 0,
                flags4b: 0,
                layerVp4b: 0,
                extraParams: 0,
                instFlags4b: 0
            },
            defines: {},
            vertexShader: c(60),
            fragmentShader: c(61)
        };
        a.exports = d
    },
    function(a, b) {
        a.exports = "\r\n\r\n#include<line_decl_common>\r\n\r\nattribute vec3 fields1;\r\nattribute vec3 fields2;\r\nattribute vec4 color4b;\r\nattribute vec4 dbId4b;\r\nattribute vec4 flags4b;\r\nattribute vec4 layerVp4b;\r\n\r\n#ifdef HAS_ELLIPTICALS\r\nattribute vec3 extraParams;\r\n#endif\r\n\r\n#ifdef USE_INSTANCING\r\nattribute vec4 instFlags4b;\r\n#endif\r\n\r\nuniform mat4 mvpMatrix;\r\n\r\nuniform float pixelsPerUnit;\r\nuniform float aaRange;\r\nuniform float viewportId;\r\nuniform float swap;\r\n\r\n\r\n\r\n\r\n\r\n#ifdef HAS_LAYERS\r\nuniform sampler2D tLayerMask;\r\n#endif\r\n\r\n#ifdef SELECTION_RENDERER\r\nuniform sampler2D tSelectionTexture;\r\nuniform vec2 vSelTexSize;\r\n#endif\r\n\r\n#ifdef SELECTION_RENDERER\r\nuniform vec4 selectionColor;\r\n#endif\r\n\r\n\r\nvec2 centralVertex;\r\nvec2 offsetPosition;\r\n\r\nvec2 cos_sin(const float angle) { return vec2(cos(angle), sin(angle)); }\r\n\r\nvoid min_max(inout vec2 minPt, inout vec2 maxPt, const vec2 p) {\r\n    minPt = min(minPt, p);\r\n    maxPt = max(maxPt, p);\r\n}\r\n\r\n#if defined(USE_INSTANCING)\r\nfloat getVertexId() { return instFlags4b.x; }\r\n#else\r\nfloat getVertexId() { return flags4b.x; }\r\n#endif\r\n\r\nbool isStartVertex() { return (getVertexId() < VBB_SEG_END_RIGHT); }\r\nbool isLeftVertex()  { float id = getVertexId(); return ((id == VBB_SEG_END_LEFT || id == VBB_SEG_START_LEFT)); }\r\n\r\nstruct SegmentData { float angle, distAlong, distTotal, lineWidthHalf, lineType; };\r\nvoid decodeSegmentData(out SegmentData seg) {\r\n    seg.angle         = fields1.z;\r\n    seg.distAlong     = fields2.x;\r\n    seg.distTotal     = fields2.z;\r\n    seg.lineWidthHalf = fields2.y;\r\n    seg.lineType      = flags4b.z;\r\n}\r\n\r\nvoid strokeLineSegment() {\r\n    SegmentData seg; decodeSegmentData(seg);\r\n\r\n    float isStartCapVertex = isStartVertex() ? -1.0 :  1.0;\r\n    float isLeftSide       = isLeftVertex( ) ?  1.0 : -1.0;\r\n\r\n\r\n    float angleTransverse = seg.angle + isLeftSide * HALF_PI;\r\n    float lwAdjustment = fsHalfWidth + aaRange;\r\n    vec2 transverseOffset = cos_sin(angleTransverse) * lwAdjustment;\r\n    offsetPosition.xy += transverseOffset;\r\n\r\n\r\n\r\n\r\n    float distanceFromStart = max(isStartCapVertex, 0.0) * seg.distAlong;\r\n    vec2 along = distanceFromStart * cos_sin(seg.angle);\r\n    offsetPosition.xy += along;\r\n    centralVertex.xy  += along;\r\n\r\n\r\n    vec2 moveOffset = isStartCapVertex * isLeftSide * vec2(-transverseOffset.y, transverseOffset.x);\r\n    offsetPosition.xy -= moveOffset;\r\n    centralVertex.xy  -= moveOffset;\r\n\r\n\r\n\r\n\r\n    fsMultipurpose.x = (isStartCapVertex * lwAdjustment) + distanceFromStart;\r\n    fsMultipurpose.y = seg.distAlong;\r\n    fsMultipurpose.z = seg.distTotal;\r\n    fsMultipurpose.w = seg.lineType;\r\n\r\n    if (seg.lineWidthHalf < 0.0)\r\n        fsHalfWidth = -fsHalfWidth;\r\n}\r\n\r\n\r\n#ifdef HAS_TRIANGLE_GEOMS\r\nstruct TriangleData { vec2 p0, p1, p2; };\r\nvoid decodeTriangleData(out TriangleData tri) {\r\n\r\n    tri.p1 = vec2(fields1.z, fields2.x);\r\n    tri.p2 = fields2.yz;\r\n}\r\n\r\nvoid strokeOneTriangle() {\r\n    TriangleData tri; decodeTriangleData(tri);\r\n\r\n\r\n\r\n\r\n\r\n\r\n    fsHalfWidth = 0.0;\r\n    fsMultipurpose.z = 0.0;\r\n\r\n\r\n\r\n\r\n\r\n    float vertexId = getVertexId();\r\n    if (vertexId == VBB_SEG_END_RIGHT)\r\n        offsetPosition.xy = tri.p1;\r\n    else if (vertexId == VBB_SEG_END_LEFT)\r\n        offsetPosition.xy = tri.p2;\r\n}\r\n#endif\r\n\r\n\r\n\r\n\r\n#ifdef HAS_RASTER_QUADS\r\nstruct TexQuadData { float angle; vec2 size; };\r\nvoid decodeTexQuadData(out TexQuadData quad) {\r\n    quad.angle     = fields1.z;\r\n    quad.size   = fields2.xy;\r\n}\r\n\r\nvoid strokeTexQuad() {\r\n    TexQuadData quad; decodeTexQuadData(quad);\r\n\r\n    vec2 corner = vec2(isLeftVertex() ? -1.0 : 1.0, isStartVertex() ? -1.0 : 1.0);\r\n\r\n    vec2 p      = 0.5 * corner * quad.size;\r\n    vec2 rot    = cos_sin(quad.angle);\r\n    vec2 offset = vec2(p.x * rot.x - p.y * rot.y, p.x * rot.y + p.y * rot.x);\r\n\r\n    offsetPosition.xy += offset;\r\n\r\n    fsMultipurpose.xy = max(vec2(0.0), corner);\r\n\r\n\r\n    fsMultipurpose.z = 1.0;\r\n    fsHalfWidth = 0.0;\r\n}\r\n#endif\r\n\r\n#if defined(HAS_CIRCLES) || defined(HAS_ELLIPTICALS)\r\nstruct ArcData { vec2 c; float start, end, major, minor, tilt; };\r\nvoid decodeArcData(out ArcData arc) {\r\n    arc.c     = fields1.xy;\r\n    arc.start = fields1.z;\r\n    arc.end   = fields2.x;\r\n    arc.major = fields2.z;\r\n#if defined(HAS_ELLIPTICALS)\r\n    arc.minor = extraParams.x;\r\n    arc.tilt  = extraParams.y;\r\n#endif\r\n}\r\n\r\nvoid strokeArc(const ArcData arc) {\r\n\r\n\r\n    float isStart = isStartVertex() ? -1.0 : 1.0;\r\n    float isLeft  = isLeftVertex()  ? -1.0 : 1.0;\r\n\r\n\r\n\r\n\r\n    vec2 minPt;\r\n    vec2 maxPt;\r\n\r\n    vec2 angles = vec2(arc.start, arc.end);\r\n    vec2 endsX = vec2(arc.c.x) + arc.major * cos(angles);\r\n    vec2 endsY = vec2(arc.c.y) + arc.minor * sin(angles);\r\n    minPt = maxPt = vec2(endsX.x, endsY.x);\r\n    min_max(minPt, maxPt, vec2(endsX.y, endsY.y));\r\n\r\n    if (arc.end > arc.start) {\r\n        if (arc.start < PI_0_5 && arc.end > PI_0_5) {\r\n            min_max(minPt, maxPt, vec2(arc.c.x, arc.c.y + arc.minor));\r\n        }\r\n        if (arc.start < PI && arc.end > PI) {\r\n            min_max(minPt, maxPt, vec2(arc.c.x - arc.major, arc.c.y));\r\n        }\r\n        if (arc.start < PI_1_5 && arc.end > PI_1_5) {\r\n            min_max(minPt, maxPt, vec2(arc.c.x, arc.c.y - arc.minor));\r\n        }\r\n    } else {\r\n\r\n        min_max(minPt, maxPt, vec2(arc.c.x + arc.major, arc.c.y));\r\n\r\n\r\n\r\n        if (arc.start < PI_0_5 || arc.end > PI_0_5) {\r\n            min_max(minPt, maxPt, vec2(arc.c.x, arc.c.y + arc.minor));\r\n        }\r\n        if (arc.start < PI || arc.end > PI) {\r\n            min_max(minPt, maxPt, vec2(arc.c.x - arc.major, arc.c.y));\r\n        }\r\n        if (arc.start < PI_1_5 || arc.end > PI_1_5) {\r\n            min_max(minPt, maxPt, vec2(arc.c.x, arc.c.y - arc.minor));\r\n        }\r\n    }\r\n\r\n    minPt -= fsHalfWidth + aaRange;\r\n    maxPt += fsHalfWidth + aaRange;\r\n\r\n    offsetPosition.x = (isStart < 0.0) ? minPt.x : maxPt.x;\r\n    offsetPosition.y = (isLeft < 0.0)  ? minPt.y : maxPt.y;\r\n\r\n\r\n\r\n\r\n\r\n    fsMultipurpose.x = arc.start;\r\n    fsMultipurpose.y = -arc.major;\r\n    fsMultipurpose.z = arc.end;\r\n    fsMultipurpose.w = arc.minor;\r\n}\r\n#endif\r\n\r\n#if defined(HAS_CIRCLES)\r\n\r\nvoid strokeCircularArc() {\r\n    ArcData arc; decodeArcData(arc);\r\n\r\n    float r = arc.major;\r\n    if (r * pixelsPerUnit < 0.125)\r\n        r = 0.25 * aaRange;\r\n    arc.major = arc.minor = r;\r\n\r\n    strokeArc(arc);\r\n}\r\n\r\n#endif\r\n\r\n#if defined(HAS_ELLIPTICALS)\r\nvoid strokeEllipticalArc() {\r\n    ArcData arc; decodeArcData(arc);\r\n    strokeArc(arc);\r\n}\r\n#endif\r\n\r\nstruct CommonAttribs { vec2 pos; vec4 color; vec2 layerTC, vpTC; float lineWidthHalf, geomType, ghosting; };\r\nvoid decodeCommonAttribs(out CommonAttribs attribs) {\r\n    attribs.pos           = fields1.xy;\r\n    attribs.color         = color4b;\r\n    attribs.geomType      = flags4b.y;\r\n    attribs.layerTC       = layerVp4b.xy / 255.0;\r\n    attribs.vpTC          = layerVp4b.zw / 255.0;\r\n    attribs.lineWidthHalf = fields2.y;\r\n    attribs.ghosting      = flags4b.w;\r\n}\r\n\r\nvoid strokeIndexedTriangle() {\r\n\r\n    fsHalfWidth = 0.0;\r\n    fsMultipurpose.z = 0.0;\r\n}\r\n\r\n#ifdef SELECTION_RENDERER\r\nbool isSelected(const CommonAttribs attribs) {\r\n\r\n\r\n    vec3 oid = dbId4b.rgb;\r\n\r\n\r\n    float id01 = oid.r + oid.g * 256.0;\r\n    float t = (id01 + 0.5) * (1.0 / 4096.0);\r\n    float flrt = floor(t);\r\n    float texU = t - flrt;\r\n\r\n\r\n    float id23 = oid.b * (65536.0 / 4096.0) + flrt;\r\n    t = (id23 + 0.5) / vSelTexSize.y;\r\n    float texV = fract(t);\r\n\r\n    vec4 selBit = texture2D(tSelectionTexture, vec2(texU, texV));\r\n    return selBit.r == 1.0;\r\n}\r\n#endif\r\n\r\nbool isLayerOff(const CommonAttribs attribs) {\r\n#ifdef HAS_LAYERS\r\n    vec4 layerBit = texture2D(tLayerMask, attribs.layerTC);\r\n    return (layerBit.r == 0.0);\r\n#else\r\n    return false;\r\n#endif\r\n}\r\n\r\nvec4 getColor(const CommonAttribs attribs) {\r\n\r\n    if (isLayerOff(attribs)) { return vec4(0.0); }\r\n\r\n#ifdef SELECTION_RENDERER\r\n    if (isSelected(attribs)) { return selectionColor; }\r\n    return vec4(0.0);\r\n#else\r\n    return attribs.color;\r\n#endif\r\n}\r\n\r\nvoid main() {\r\n    CommonAttribs attribs; decodeCommonAttribs(attribs);\r\n\r\n    fsColor = getColor(attribs);\r\n\r\n    if (swap != 0.0 ) {\r\n\r\n        if ( fsColor.r == 0.0 && fsColor.g == 0.0 && fsColor.b == 0.0 )\r\n            fsColor.rgb = vec3(1.0,1.0,1.0);\r\n\r\n        else if ( fsColor.r == 1.0 && fsColor.g == 1.0 && fsColor.b == 1.0 )\r\n            fsColor.rgb = vec3(0.0,0.0,0.0);\r\n    }\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n    centralVertex = offsetPosition = attribs.pos;\r\n\r\n    float lineWeight = attribs.lineWidthHalf;\r\n    if (lineWeight > 0.0) {\r\n\r\n\r\n        if(lineWeight < 0.5 / pixelsPerUnit) {\r\n            lineWeight = 0.5 / pixelsPerUnit;\r\n        }\r\n    }\r\n    else {\r\n\r\n\r\n        lineWeight = abs(lineWeight) / pixelsPerUnit;\r\n    }\r\n\r\n    fsHalfWidth = lineWeight;\r\n\r\n    dbId = dbId4b / 255.0;\r\n\r\n    fsVpTC     = attribs.vpTC;\r\n    fsGhosting = attribs.ghosting;\r\n\r\n    if      (attribs.geomType == VBB_GT_LINE_SEGMENT)     strokeLineSegment();\r\n#ifdef HAS_CIRCLES\r\n    else if (attribs.geomType == VBB_GT_ARC_CIRCULAR)     strokeCircularArc();\r\n#endif\r\n#ifdef HAS_ELLIPTICALS\r\n    else if (attribs.geomType == VBB_GT_ARC_ELLIPTICAL)   strokeEllipticalArc();\r\n#endif\r\n#ifdef HAS_RASTER_QUADS\r\n    else if (attribs.geomType == VBB_GT_TEX_QUAD)         strokeTexQuad();\r\n#endif\r\n#ifdef HAS_TRIANGLE_GEOMS\r\n    else if (attribs.geomType == VBB_GT_ONE_TRIANGLE)     strokeOneTriangle();\r\n#endif\r\n    else if (attribs.geomType == VBB_GT_TRIANGLE_INDEXED) strokeIndexedTriangle();\r\n\r\n\r\n\r\n    fsOffsetDirection = offsetPosition - centralVertex;\r\n\r\n\r\n    gl_Position = mvpMatrix * modelMatrix * vec4( offsetPosition.xy, 0.0, 1.0 );\r\n}\r\n"
    },
    function(a, b) {
        a.exports = "\r\n\r\n\r\n#include<line_decl_common>\r\n\r\nuniform highp float pixelsPerUnit;\r\nuniform highp float aaRange;\r\n\r\nuniform float opacity;\r\nuniform highp float viewportId;\r\nuniform highp float swap;\r\n\r\n#ifdef HAS_RASTER_QUADS\r\nuniform sampler2D tRaster;\r\n#endif\r\n\r\n#ifdef HAS_LINESTYLES\r\nuniform sampler2D tLineStyle;\r\nuniform vec2 vLineStyleTexSize;\r\n#endif\r\n\r\n#if defined(MRT_ID_BUFFER) || defined(MODEL_COLOR)\r\nuniform vec3 modelId;\r\n#endif\r\n\r\n\r\nfloat curveGaussian(float r, float invWidth) {\r\n    float amt = clamp(r * invWidth, 0.0, 1.0);\r\n\r\n    float exponent = amt * 2.0;\r\n\r\n    return exp(-exponent*exponent);\r\n\r\n\r\n\r\n}\r\n\r\n#ifdef HAS_LINESTYLES\r\nfloat getLinePatternPixel(int i, int j) {\r\n\r\n    return texture2D(tLineStyle, (vec2(i, j) + 0.5) / vLineStyleTexSize).x * 255.0;\r\n}\r\n\r\nfloat getPatternLength(int whichPattern) {\r\n    float p1 = getLinePatternPixel(0, whichPattern);\r\n    float p2 = getLinePatternPixel(1, whichPattern);\r\n    return (p2 * 256.0 + p1);\r\n}\r\n#endif\r\n\r\n\r\nvoid fillLineSegment() {\r\n\r\n    float radius = abs(fsHalfWidth);\r\n    float parametricDistance = fsMultipurpose.x;\r\n    float segmentLength      = fsMultipurpose.y;\r\n    float totalDistance      = fsMultipurpose.z;\r\n\r\n\r\n#ifdef HAS_LINESTYLES\r\n    int whichPattern         = int(fsMultipurpose.w);\r\n\r\n    if (whichPattern > 0) {\r\n        const float TEX_TO_UNIT = 1.0 / 96.0;\r\n\r\n\r\n\r\n\r\n        float LTSCALE = 1.0;\r\n        float patternScale;\r\n\r\n\r\n\r\n        if (fsHalfWidth < 0.0) {\r\n            patternScale = LTSCALE;\r\n        } else {\r\n            patternScale = LTSCALE * TEX_TO_UNIT * pixelsPerUnit;\r\n        }\r\n\r\n        float patLen = patternScale * getPatternLength(whichPattern);\r\n        float phase = mod((totalDistance + parametricDistance) * pixelsPerUnit, patLen);\r\n\r\n        bool onPixel = true;\r\n        float radiusPixels = radius * pixelsPerUnit;\r\n\r\n        for (int i=2; i<MAX_LINESTYLE_LENGTH; i+=2) {\r\n\r\n            float on = getLinePatternPixel(i, whichPattern);\r\n            if (on == 1.0) on = 0.0;\r\n            on *= patternScale;\r\n\r\n            onPixel = true;\r\n            phase -= on;\r\n            if (phase < 0.0) {\r\n                break;\r\n            }\r\n            else if (phase <= radiusPixels) {\r\n                onPixel = false;\r\n                break;\r\n            }\r\n\r\n            float off = getLinePatternPixel(i+1, whichPattern);\r\n            if (off <= 1.0) off = 0.0;\r\n            off *= patternScale;\r\n\r\n            onPixel = false;\r\n            phase -= off;\r\n            if (phase < -radiusPixels)\r\n                discard;\r\n            if (phase <= 0.0)\r\n                break;\r\n        }\r\n\r\n\r\n\r\n\r\n        if (!onPixel && (abs(phase) <= radiusPixels)) {\r\n            segmentLength = 0.0;\r\n            parametricDistance = phase / pixelsPerUnit;\r\n        }\r\n    }\r\n#endif\r\n\r\n\r\n\r\n\r\n    float dist;\r\n    float offsetLength2 = dot(fsOffsetDirection, fsOffsetDirection);\r\n\r\n\r\n\r\n\r\n    float ltz = max(0.0, sign(-parametricDistance));\r\n    float gtsl = max(0.0, sign(parametricDistance - segmentLength));\r\n    float d = (ltz + gtsl) * (parametricDistance - gtsl * segmentLength);\r\n    dist = sqrt(max(0.0, offsetLength2 + d*d));\r\n\r\n\r\n\r\n\r\n    float range =  dist - radius;\r\n\r\n    if (range > aaRange) {\r\n        discard;\r\n    }\r\n\r\n\r\n\r\n\r\n\r\n\r\n    gl_FragColor = fsColor;\r\n    gl_FragColor.a *= curveGaussian(range+aaRange, pixelsPerUnit);\r\n}\r\n\r\n#ifdef HAS_CIRCLES\r\nvoid fillCircularArc() {\r\n\r\n    float dist   = length(fsOffsetDirection);\r\n    vec2 angles  = fsMultipurpose.xz;\r\n    float radius = abs(fsMultipurpose.y);\r\n    float range  =  abs(dist - radius);\r\n    range -= fsHalfWidth;\r\n\r\n\r\n\r\n    if (range > aaRange) {\r\n        discard;\r\n    }\r\n\r\n    vec2 direction = fsOffsetDirection;\r\n    float angle = atan(direction.y, direction.x);\r\n\r\n\r\n\r\n\r\n    if (angles.x > angles.y) {\r\n\r\n        if (angle > angles.x && angle < PI) {\r\n            angle -= TAU;\r\n        }\r\n        angles.x -= TAU;\r\n\r\n\r\n\r\n        if (angle < angles.x ) {\r\n            angle += TAU;\r\n        }\r\n    }\r\n    else if (angle < 0.0)\r\n        angle += TAU;\r\n\r\n\r\n    if (angle > angles.x && angle < angles.y) {\r\n        gl_FragColor = fsColor;\r\n        gl_FragColor.a *= curveGaussian(range+aaRange, pixelsPerUnit);\r\n    }\r\n    else {\r\n        discard;\r\n    }\r\n\r\n}\r\n#endif\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n#ifdef HAS_ELLIPTICALS\r\n\r\n\r\n\r\n\r\n\r\n\r\nfloat EllipticalApprox(\r\n        const int iters,\r\n        inout float t0, inout float t1,\r\n        const vec2 y,   out   vec2 x,\r\n        const vec2 e,   const vec2 ey, const vec2 esqr\r\n        ) {\r\n    vec2 r;\r\n    for (int i = 0; i < 10; ++i) {\r\n        if(i >= iters) break;\r\n\r\n        float t = mix(t0, t1, 0.5);\r\n        r = ey / (vec2(t) + esqr);\r\n\r\n        vec2 rsq = r * r;\r\n        float f = rsq.x + rsq.y - 1.0;\r\n\r\n        if(f > 0.0) { t0 = t; } else { t1 = t; }\r\n    }\r\n\r\n    x = e * r;\r\n    return distance(x, y);\r\n}\r\n\r\nfloat DistancePointEllipseSpecial (vec2 e, vec2 y, out vec2 x, float width, float aaRange) {\r\n    float dist;\r\n\r\n\r\n    vec2 esqr = e * e;\r\n    vec2 ey   = e * y;\r\n    float t0 = -esqr[1] + ey[1];\r\n    float t1 = -esqr[1] + length(ey);\r\n\r\n\r\n\r\n    dist = EllipticalApprox(6, t0, t1, y, x, e, ey, esqr);\r\n\r\n\r\n    if (dist > max(2.0 * (width + aaRange), e[0] * 0.05))\r\n        return dist;\r\n\r\n\r\n    dist = EllipticalApprox(6, t0, t1, y, x, e, ey, esqr);\r\n\r\n\r\n\r\n\r\n    float ecc = 1.0 +  0.1 * e[0] / e[1];\r\n\r\n    if (dist > max(ecc * (width + aaRange), e[0] * 0.001))\r\n        return dist;\r\n    if (dist < (width - aaRange) / ecc)\r\n        return dist;\r\n\r\n\r\n\r\n\r\n    dist = EllipticalApprox(10, t0, t1, y, x, e, ey, esqr);\r\n    return dist;\r\n}\r\n\r\n\r\n\r\n\r\n\r\n\r\nfloat DistancePointEllipse(vec2 e, vec2 y, out vec2 locX, float width, float aaRange) {\r\n    vec2 locE, locY;\r\n\r\n\r\n\r\n\r\n    float diff = sign(e[0] - e[1]);\r\n    vec2 swizzle = vec2(max(diff, 0.0), -min(diff, 0.0));\r\n    locE.x = dot(e, swizzle.xy);\r\n    locE.y = dot(e, swizzle.yx);\r\n    locY.x = dot(y, swizzle.xy);\r\n    locY.y = dot(y, swizzle.yx);\r\n\r\n\r\n    vec2 refl = sign(locY);\r\n    locY *= refl;\r\n\r\n    vec2 x;\r\n    float distance = DistancePointEllipseSpecial(locE, locY, x, width, aaRange);\r\n\r\n    x *= refl;\r\n\r\n    locX.x = dot(x, swizzle.xy);\r\n    locX.y = dot(x, swizzle.yx);\r\n\r\n    return distance;\r\n}\r\n\r\n\r\n\r\n\r\n\r\n\r\nvoid fillEllipticalArc() {\r\n    vec2 angles = fsMultipurpose.xz;\r\n    vec2 radii  = abs(fsMultipurpose.yw);\r\n    vec2 dir    = fsOffsetDirection;\r\n\r\n\r\n\r\n\r\n    vec2 pos;\r\n    float range = DistancePointEllipse(radii, dir, pos, fsHalfWidth, aaRange);\r\n    range -= fsHalfWidth;\r\n\r\n    if (range > aaRange)\r\n        discard;\r\n\r\n    float ar = radii[0] / radii[1];\r\n\r\n\r\n\r\n\r\n    float angle = atan(ar * pos.y, pos.x);\r\n\r\n\r\n\r\n\r\n    if (angles.x > angles.y) {\r\n\r\n        if (angle > angles.x && angle < PI) {\r\n            angle -= TAU;\r\n        }\r\n        angles.x -= TAU;\r\n\r\n\r\n\r\n        if (angle < angles.x ) {\r\n            angle += TAU;\r\n        }\r\n    }\r\n    else if (angle < 0.0)\r\n        angle += TAU;\r\n\r\n\r\n    if (angle > angles.x && angle < angles.y) {\r\n        gl_FragColor = fsColor;\r\n        gl_FragColor.a *= curveGaussian(range+aaRange, pixelsPerUnit);\r\n    }\r\n    else {\r\n        discard;\r\n    }\r\n}\r\n#endif\r\n\r\n#ifdef HAS_RASTER_QUADS\r\nvoid fillTexQuad() { gl_FragColor = texture2D(tRaster, fsMultipurpose.xy); }\r\n#endif\r\n\r\nvoid fillTriangle() { gl_FragColor = fsColor; }\r\n\r\nvoid main() {\r\n\r\n\r\n\r\n\r\n\r\n    if (fsColor == vec4(0.0)) {\r\n        discard;\r\n    }\r\n\r\n\r\n    if (fsHalfWidth == 0.0) {\r\n#ifdef HAS_RASTER_QUADS\r\n        if (fsMultipurpose.z != 0.0)\r\n            fillTexQuad();\r\n        else\r\n#endif\r\n            fillTriangle();\r\n    }\r\n    else if (fsMultipurpose.y < 0.0) {\r\n#ifdef HAS_CIRCLES\r\n#ifdef HAS_ELLIPTICALS\r\n        if (abs(fsMultipurpose.y) == fsMultipurpose.w)\r\n#endif\r\n            fillCircularArc();\r\n#endif\r\n#ifdef HAS_ELLIPTICALS\r\n#ifdef HAS_CIRCLES\r\n        else\r\n#endif\r\n            fillEllipticalArc();\r\n#endif\r\n    }\r\n    else\r\n        fillLineSegment();\r\n\r\n\r\n#ifdef MRT_NORMALS\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n    gl_FragData[1] = vec4(0.0);\r\n#endif\r\n\r\n\r\n\r\n\r\n\r\n\r\n    float writeId = 1.0;\r\n\r\n\r\n\r\n\r\n    if (fsGhosting != 0.0 || \r\n            ((viewportId != 0.0) && (abs(fsVpTC.x * 255.0 + fsVpTC.y) >= 0.5 && abs(fsVpTC.x * 255.0 + fsVpTC.y - viewportId) >= 0.5))) {\r\n\r\n        writeId = 0.0;\r\n\r\n\r\n\r\n        gl_FragColor.a *= opacity * ((swap == 1.0) ? 0.21 : 0.1);\r\n    } else {\r\n\r\n        gl_FragColor.a *= opacity;\r\n    }\r\n\r\n#include<id_frag>\r\n}\r\n"
    },
    function(a, b, c) {
        "use strict";
        var d = {
            uniforms: {
                color: {
                    type: "v3",
                    value: new THREE.Vector3(0, 0, 0)
                },
                opacity: {
                    type: "f",
                    value: 1
                }
            },
            vertexShader: c(63),
            fragmentShader: c(64),
            rawShader: !0
        };
        a.exports = d
    },
    function(a, b) {
        a.exports = "\n#include<instancing_decl_vert>\nvarying vec4 finalColor;\nuniform vec3 color;\nuniform float opacity;\nvoid main() {\n    gl_Position = projectionMatrix * (viewMatrix * vec4(getInstancePos(position), 1.0));\n    finalColor = vec4(color, opacity);\n}\n"
    },
    function(a, b) {
        a.exports = "precision lowp float;\nvarying vec4 finalColor;\nvoid main() {\n    gl_FragColor = finalColor;\n}\n"
    },
    function(a, b, c) {
        "use strict";
        var d = c(66),
            e = function(a, b) {
                this.textureID = void 0 !== b ? b: "tDiffuse",
                    this.material = d.createShaderMaterial(a),
                    this.uniforms = this.material.uniforms,
                    this.renderToScreen = !1,
                    this.enabled = !0,
                    this.clear = !1,
                    this.camera = new THREE.OrthographicCamera( - 1, 1, 1, -1, 0, 1);
                var c = new THREE.BufferGeometry,
                    e = new Float32Array(9);
                e[0] = -1,
                    e[1] = -1,
                    e[2] = 0,
                    e[3] = 3,
                    e[4] = -1,
                    e[5] = 0,
                    e[6] = -1,
                    e[7] = 3,
                    e[8] = 0;
                var f = new Float32Array(6);
                f[0] = 0,
                    f[1] = 0,
                    f[2] = 2,
                    f[3] = 0,
                    f[4] = 0,
                    f[5] = 2;
                var g = new Float32Array(9);
                g[0] = 0,
                    g[1] = 0,
                    g[2] = 1,
                    g[3] = 0,
                    g[4] = 0,
                    g[5] = 1,
                    g[6] = 0,
                    g[7] = 0,
                    g[8] = 1,
                    c.addAttribute("position", new THREE.BufferAttribute(e, 3)),
                    c.addAttribute("normal", new THREE.BufferAttribute(g, 3)),
                    c.addAttribute("uv", new THREE.BufferAttribute(f, 2)),
                    this.quad = new THREE.Mesh(c, this.material),
                    this.scene = new THREE.Scene,
                    this.scene.add(this.quad)
            };
        e.prototype = {
            render: function(a, b, c, d) {
                this.uniforms[this.textureID] && (this.uniforms[this.textureID].value = c),
                    this.renderToScreen || !b ? a.render(this.scene, this.camera) : a.render(this.scene, this.camera, b, this.clear)
            }
        },
            a.exports = e
    },
    function(a, b) {
        "use strict";
        var c = function(a) {
                var b = {
                    vertexShader: a.vertexShader,
                    fragmentShader: a.fragmentShader
                };
                return a.uniforms && (b.uniforms = THREE.UniformsUtils.clone(a.uniforms)),
                a.defines && (b.defines = THREE.UniformsUtils.clone(a.defines)),
                a.attributes && (b.attributes = a.attributes),
                    new THREE.ShaderMaterial(b)
            },
            d = function(a, b, c) {
                c = c || "",
                a.defines || (a.defines = {}),
                a.defines[b] != c && (a.defines[b] = c, a.needsUpdate = !0)
            },
            e = function(a, b) { (a.defines || a.defines[b]) && (delete a.defines[b], a.needsUpdate = !0)
            };
        a.exports = {
            createShaderMaterial: c,
            setMacro: d,
            removeMacro: e
        }
    },
    function(a, b, c) {
        "use strict";
        var d = c(65),
            e = {
                uniforms: {
                    tDiffuse: {
                        type: "t",
                        value: null
                    },
                    uColor: {
                        type: "v4",
                        value: new THREE.Vector4(1, 1, 1, 1)
                    }
                },
                vertexShader: c(68),
                fragmentShader: c(69)
            },
            f = function(a, b, c, f, g) {
                var h, i, j, k = a,
                    l = b,
                    m = c || 3,
                    n = f || 1,
                    o = {
                        hasAlpha: g.hasAlpha || !1,
                        blending: g.blending || !1,
                        flipUV: g.flipUV || !1
                    };
                this.render = function(a, b, c) {
                    h.render(a, j, c),
                        i.render(a, b, j)
                },
                    this.setSize = function(a, b) {
                        this.cleanup(),
                            k = a,
                            l = b,
                            j = new THREE.WebGLRenderTarget(a, b, {
                                minFilter: THREE.LinearFilter,
                                magFilter: THREE.LinearFilter,
                                format: void 0 !== g.format ? g.format: THREE.RGBAFormat,
                                type: void 0 !== g.type ? g.type: THREE.UnsignedByteType,
                                stencilBuffer: !1
                            }),
                            j.generateMipmaps = !1,
                            h.material.defines.KERNEL_SCALE_H = i.material.defines.KERNEL_SCALE_H = (n / k).toFixed(4),
                            h.material.defines.KERNEL_SCALE_V = i.material.defines.KERNEL_SCALE_V = (n / l).toFixed(4),
                            h.material.needsUpdate = i.material.needsUpdate = !0
                    },
                    this.cleanup = function() {
                        j && j.dispose()
                    },
                    this.setColor = function(a) {
                        i.material.uniforms.uColor.value.x = a.r,
                            i.material.uniforms.uColor.value.y = a.g,
                            i.material.uniforms.uColor.value.z = a.b
                    },
                    this.setAlpha = function(a) {
                        i.material.uniforms.uColor.value.w = a
                    },
                    h = new d(e),
                    i = new d(e),
                    this.setSize(a, b),
                    h.material.blending = i.material.blending = THREE.NoBlending,
                    h.material.depthWrite = i.material.depthWrite = !1,
                    h.material.depthTest = i.material.depthTest = !1,
                    h.material.defines.HORIZONTAL = 1,
                    h.material.defines.KERNEL_RADIUS = i.material.defines.KERNEL_RADIUS = m.toFixed(1),
                o.blending && (i.material.transparent = !0, i.material.blending = THREE.NormalBlending),
                o.hasAlpha && (h.material.defines.HAS_ALPHA = i.material.defines.HAS_ALPHA = ""),
                o.flipUV && (h.material.defines.FLIP_UV = "")
            };
        a.exports = f
    },
    function(a, b) {
        a.exports = "varying vec2 vUv;\nvoid main() {\n#if defined(HORIZONTAL) && defined(FLIP_UV)\n    vUv = vec2(uv.x, 1.0-uv.y);\n#else\n    vUv = vec2(uv.x, uv.y);\n#endif\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}\n"
    },
    function(a, b) {
        a.exports = "uniform sampler2D tDiffuse;\nuniform vec4 uColor;\nvarying vec2 vUv;\n#ifdef HORIZONTAL\n#define GET_UV(X) vec2(vUv.x + KERNEL_SCALE_H*(X), vUv.y)\n#else\n#define GET_UV(Y) vec2(vUv.x, vUv.y + KERNEL_SCALE_V*(Y))\n#endif\n#define PI 3.14159265358979\n#define SIGMA ((KERNEL_RADIUS+KERNEL_RADIUS+1.0) / 6.0)\n#define SIGMASQ2 (2.0 * SIGMA * SIGMA)\n#define GAUSSIAN(X) ( (1.0 / sqrt(PI * SIGMASQ2)) * exp(-(X)*(X)/SIGMASQ2) )\nvoid main() {\n    vec4 texColSum = vec4(0.0);\n    float gaussSum = 0.0;\n    for (float x=-KERNEL_RADIUS; x<=KERNEL_RADIUS; x+=1.0) {\n        float gauss = GAUSSIAN(x);\n        vec4 texCol = texture2D(tDiffuse, GET_UV(x));\n#ifdef HAS_ALPHA\n        texCol.rgb *= texCol.a;\n#endif\n        texColSum += texCol * gauss;\n        gaussSum += gauss;\n    }\n#ifdef HAS_ALPHA\n    texColSum.rgb /= (texColSum.a == 0.0 ? 0.0001 : texColSum.a);\n#endif\n#ifdef HORIZONTAL\n    gl_FragColor = texColSum/gaussSum;\n#else\n    gl_FragColor = texColSum/gaussSum * uColor;\n#endif\n}\n"
    },
    function(a, b, c) {
        "use strict";
        var d = c(71),
            e = c(65),
            f = c(67),
            g = c(1),
            h = {
                uniforms: {
                    tDiffuse: {
                        type: "t",
                        value: null
                    }
                },
                vertexShader: c(72),
                fragmentShader: c(73)
            },
            i = function(a, b, c, i) {
                var j, k, l, m, n, o, p = a,
                    q = p.getContext(),
                    r = b || 512,
                    s = c || 512,
                    t = !1,
                    u = new THREE.Color(0, 0, 0),
                    v = !1,
                    w = !1;
                this.inTarget = void 0,
                    this.outTarget = void 0;
                var x = !0,
                    y = d.GROUND_UNFINISHED,
                    z = {
                        color: new THREE.Color(1, 1, 1),
                        alpha: .3,
                        texScale: .5,
                        blurRadius: 2,
                        blurTexScale: .5,
                        fadeAngle: Math.PI / 18
                    },
                    A = function(a) {
                        var b = a.normal,
                            c = a.constant;
                        return (new THREE.Matrix4).set(1 - 2 * b.x * b.x, -2 * b.y * b.x, -2 * b.x * b.z, -2 * c * b.x, -2 * b.x * b.y, 1 - 2 * b.y * b.y, -2 * b.y * b.z, -2 * c * b.y, -2 * b.x * b.z, -2 * b.y * b.z, 1 - 2 * b.z * b.z, -2 * c * b.z, 0, 0, 0, 1)
                    };
                if (this.setTransform = function(a, b, c) {
                        m = a,
                            l.normal = b,
                            l.constant = -a.dot(b)
                    },
                        this.cleanup = function() {
                            j && j.cleanup(),
                            this.inTarget && this.inTarget.dispose(),
                            this.outTarget && this.outTarget.dispose()
                        },
                        this.setSize = function(a, b) {
                            r = a,
                                s = b,
                                this.cleanup(),
                                this.inTarget = new THREE.WebGLRenderTarget(r * z.texScale, s * z.texScale, {
                                    magFilter: THREE.LinearFilter,
                                    minFilter: THREE.LinearFilter,
                                    format: THREE.RGBAFormat,
                                    stencilBuffer: !1
                                }),
                                this.inTarget.generateMipmaps = !1,
                                this.outTarget = new THREE.WebGLRenderTarget(r * z.texScale, s * z.texScale, {
                                    magFilter: THREE.LinearFilter,
                                    minFilter: THREE.LinearFilter,
                                    format: THREE.RGBAFormat,
                                    stencilBuffer: !1
                                }),
                                this.outTarget.generateMipmaps = !1,
                                j ? j.setSize(r * z.texScale * z.blurTexScale, s * z.texScale * z.blurTexScale) : j = new f(r * z.texScale * z.blurTexScale, s * z.texScale * z.blurTexScale, z.blurRadius, 1, {
                                    hasAlpha: !0,
                                    blending: !0,
                                    flipUV: !0
                                })
                        },
                        this.updateCamera = function(a) {
                            var b;
                            b = a.isPerspective ? m.clone() : a.target.clone();
                            var c = a.position.clone().sub(b).normalize(),
                                d = Math.PI / 2 - c.angleTo(l.normal);
                            if (! (t = d < 0)) {
                                if (z.fadeAngle > 0) {
                                    var e = Math.min(z.fadeAngle, d) / z.fadeAngle;
                                    j.setAlpha(e * z.alpha)
                                }
                                var f = A(l);
                                n = a.clone(),
                                    n.applyMatrix(f),
                                    n.projectionMatrix.elements[5] *= -1,
                                    n.matrixWorldNeedsUpdate = !0,
                                    a.worldUpTransform ? n.worldUpTransform = a.worldUpTransform.clone() : n.worldUpTransform = new THREE.Matrix4
                            }
                        },
                        this.renderIntoReflection = function(a) {
                            t || p.render(a, n, this.inTarget)
                        },
                        this.prepareGroundReflection = function() {
                            var a, b = 0,
                                c = 0,
                                e = 0;
                            return function(f, g, h, i, j, k) {
                                var l = g.modelQueue();
                                if (y !== d.GROUND_UNFINISHED || l.isEmpty()) return y = d.GROUND_FINISHED,
                                    j;
                                if (a != l.getGeomScenes() && (x = !0), x) {
                                    if (x = !1, this.updateCamera(g.camera), this.isGroundCulled()) return y = d.GROUND_FINISHED,
                                        j;
                                    this.clear(),
                                        a = l.getGeomScenes(),
                                        b = a.length,
                                        c = 0,
                                        e = i ? Math.max(Math.ceil(b / 100), i) : b,
                                        y = d.GROUND_UNFINISHED
                                } else {
                                    if (y !== d.GROUND_UNFINISHED) return y = d.GROUND_FINISHED,
                                        j;
                                    0 === i && (e = b)
                                }
                                var m, n;
                                j && (m = performance.now(), k = void 0 === k ? 1 : k, n = k * j);
                                for (var o, p = 0; p < e && c < b;) {
                                    var q = a[c++];
                                    if (q && (p++, q.forceVisible = !0, this.renderIntoReflection(q), q.forceVisible = !1, j)) {
                                        var r = performance.now() - m;
                                        if (n < r && c < b) {
                                            y = d.GROUND_UNFINISHED,
                                                o = j - r;
                                            break
                                        }
                                    }
                                }
                                return c < b && (y = d.GROUND_UNFINISHED, o = j ? j - performance.now() + m: 1),
                                    void 0 === o || h ? (this.postprocess(g.camera, g.matman()), f && f.enabled && g.renderGroundShadow(this.outTarget), this.renderReflection(g.camera, g.renderer().getColorTarget()), void 0 === o && (y = d.GROUND_RENDERED), j ? j - performance.now() + m: 1) : o
                            }
                        } (), this.renderReflection = function(a, b) {
                        t || (q.depthRange(.999999, 1), k.render(p, b, this.outTarget), q.depthRange(0, 1))
                    },
                        this.toggleEnvMapBackground = function(a) {
                            w = a,
                                o.uniforms.envMapBackground.value = a
                        },
                        this.postprocess = function(a) {
                            t || (v || w ? (o.uniforms.uCamDir.value = a.worldUpTransform ? a.getWorldDirection().clone().applyMatrix4(a.worldUpTransform) : a.getWorldDirection(), o.uniforms.uCamUp.value = a.worldUpTransform ? a.up.clone().applyMatrix4(a.worldUpTransform) : a.up, o.uniforms.uResolution.value.set(r, s), o.uniforms.uHalfFovTan.value = Math.tan(THREE.Math.degToRad(.5 * a.fov)), o.render(p, this.outTarget), p.clearTarget(this.outTarget, !1, !0, !1)) : (p.setClearColor(u, 1), p.clearTarget(this.outTarget, !0, !0, !1)), j.render(p, this.outTarget, this.inTarget))
                        },
                        this.clear = function() {
                            p.setClearColor(u, 0),
                                p.clearTarget(this.inTarget, !0, !0, !1),
                                p.clearBlend()
                        },
                        this.setClearColors = function(a, b, c) {
                            b ? (u.setRGB(.5 * (a.x + b.x), .5 * (a.y + b.y), .5 * (a.z + b.z)), v = !a.equals(b) && !c) : (u.copy(a), v = !1),
                            v && (o.uniforms.color1.value.copy(a), o.uniforms.color2.value.copy(b))
                        },
                        this.setEnvRotation = function(a) {
                            o.material.envRotationSin = Math.sin(a),
                                o.material.envRotationCos = Math.cos(a)
                        },
                        this.isGroundCulled = function() {
                            return t
                        },
                        this.getStatus = function() {
                            return y
                        },
                        this.setDirty = function() {
                            x = !0,
                                y = d.GROUND_UNFINISHED
                        },
                        this.setColor = function(a) {
                            j.setColor(z.color),
                                z.color.set(a)
                        },
                        this.setAlpha = function(a) {
                            j.setAlpha(z.alpha),
                                z.alpha = a
                        },
                        i) for (var B in z) z[B] = void 0 !== i[B] ? i[B] : z[B];
                k = new e(h),
                    k.material.blending = THREE.NoBlending,
                    k.material.depthTest = !0,
                    k.material.depthWrite = !1,
                    k.scene.position.z = -.999999,
                    i.clearPass ? o = i.clearPass: (o = new e(g), o.material.blending = THREE.NoBlending, o.material.depthWrite = !1, o.material.depthTest = !1),
                    this.setSize(r, s),
                    j.setAlpha(z.color),
                    j.setAlpha(z.alpha),
                    l = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0),
                    m = new THREE.Vector3(0, 0, 0)
            };
        i.prototype.constructor = i,
            a.exports = i
    },
    function(a, b) {
        "use strict";
        var c = {},
            d = "undefined" != typeof navigator ? navigator.userAgent.toLowerCase() : "";
        c.isIOSDevice = function() {
            return d.match(/ip(ad|hone|od)/)
        },
            c.isAndroidDevice = function() {
                return - 1 !== d.indexOf("android")
            },
            c.isMobileDevice = function() {
                return c.isIOSDevice() || c.isAndroidDevice()
            },
            c.isSafari = function() {
                return - 1 !== d.indexOf("safari") && -1 === d.indexOf("chrome")
            },
            c.isFirefox = function() {
                return - 1 !== d.indexOf("firefox")
            },
            c.isMac = function() {
                return - 1 !== d.indexOf("mac os")
            },
            c.isWindows = function() {
                return - 1 !== d.indexOf("win32") || -1 !== d.indexOf("windows")
            },
            c.isNodeJS = function() {
                return "undefined" == typeof navigator
            },
            c.rescueFromPolymer = function() {
                return c.isSafari() ?
                    function(a) {
                        if (!window.Polymer) return a;
                        for (var b in a) if ( - 1 !== b.indexOf("__impl")) return a[b];
                        return a
                    }: function(a) {
                    return a
                }
            } (),
            c.memoryOptimizedLoading = !0,
            c.GPU_MEMORY_LIMIT = 1024 * (c.isMobileDevice() ? 64 : 256) * 1024,
            c.GPU_OBJECT_LIMIT = c.isMobileDevice() ? 2500 : 1e4,
            c.GEOMETRY_OVERHEAD = 464,
            c.PIXEL_CULLING_THRESHOLD = 1,
            c.PAGEOUT_SUCCESS = 0,
            c.PAGEOUT_FAIL = 1,
            c.PAGEOUT_NONE = 2,
            c.RENDER_NORMAL = 0,
            c.RENDER_HIGHLIGHTED = 1,
            c.RENDER_HIDDEN = 2,
            c.RENDER_SHADOWMAP = 3,
            c.RENDER_FINISHED = 4,
            c.GROUND_UNFINISHED = 0,
            c.GROUND_FINISHED = 1,
            c.GROUND_RENDERED = 2,
            c.MESH_VISIBLE = 1,
            c.MESH_HIGHLIGHTED = 2,
            c.MESH_HIDE = 4,
            c.MESH_ISLINE = 8,
            c.MESH_MOVED = 16,
            c.MESH_TRAVERSED = 32,
            c.MESH_DRAWN = 64,
            c.MESH_RENDERFLAG = 128,
            c.MESH_ISPOINT = 256,
            c.MESH_ISWIDELINE = 512,
            a.exports = c
    },
    function(a, b) {
        a.exports = "varying vec2 vUv;\nvoid main() {\n    vUv = uv;\n    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}\n"
    },
    function(a, b) {
        a.exports = "uniform sampler2D tDiffuse;\nvarying vec2 vUv;\nvoid main() {\n    vec4 texel = texture2D( tDiffuse, vUv );\n    gl_FragColor = texel;\n}\n"
    },
    function(a, b) {
        "use strict";
        var c = function(a, b, c) {
            var d = a.createShader(b);
            return a.shaderSource(d, c),
                a.compileShader(d),
                d
        };
        a.exports = c
    },
    function(a, b, c) {
        "use strict";
        var d = c(5),
            e = {
                uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib.common, THREE.UniformsLib.bump, THREE.UniformsLib.normalmap, THREE.UniformsLib.lights, THREE.UniformsLib.fog, d.CutPlanesUniforms, d.IdUniforms, d.ThemingUniform, d.ShadowMapUniforms, d.WideLinesUniforms, {
                    emissive: {
                        type: "c",
                        value: new THREE.Color(0)
                    },
                    specular: {
                        type: "c",
                        value: new THREE.Color(1118481)
                    },
                    shininess: {
                        type: "f",
                        value: 30
                    },
                    reflMipIndex: {
                        type: "f",
                        value: 0
                    },
                    texMatrix: {
                        type: "m3",
                        value: new THREE.Matrix3
                    },
                    texMatrixBump: {
                        type: "m3",
                        value: new THREE.Matrix3
                    },
                    texMatrixAlpha: {
                        type: "m3",
                        value: new THREE.Matrix3
                    },
                    irradianceMap: {
                        type: "t",
                        value: null
                    },
                    exposureBias: {
                        type: "f",
                        value: 1
                    },
                    envMapExposure: {
                        type: "f",
                        value: 1
                    },
                    envRotationSin: {
                        type: "f",
                        value: 0
                    },
                    envRotationCos: {
                        type: "f",
                        value: 1
                    }
                }]),
                vertexShader: c(76),
                fragmentShader: c(77)
            };
        THREE.ShaderLib.firefly_phong = e,
            a.exports = e
    },
    function(a, b) {
        a.exports = "varying vec3 vViewPosition;\r\n#ifndef FLAT_SHADED\r\nvarying vec3 vNormal;\r\n#endif\r\n\r\n#if defined( USE_MAP ) || defined( USE_SPECULARMAP )\r\nvarying vec2 vUv;\r\nuniform mat3 texMatrix;\r\n#endif\r\n\r\n#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP )\r\nvarying vec2 vUvBump;\r\nuniform mat3 texMatrixBump;\r\n#endif\r\n\r\n#if defined( USE_ALPHAMAP )\r\nvarying vec2 vUvAlpha;\r\nuniform mat3 texMatrixAlpha;\r\n#endif\r\n\r\n#if defined( USE_ENVMAP )\r\n#if ! defined( USE_BUMPMAP ) && ! defined( USE_NORMALMAP )\r\nuniform float refractionRatio;\r\n#endif\r\n#endif\r\n\r\n#if MAX_SPOT_LIGHTS > 0 || NUM_CUTPLANES > 0\r\nvarying vec3 vWorldPosition;\r\n#endif\r\n\r\n#ifdef USE_COLOR\r\nvarying vec3 vColor;\r\n#endif\r\n\r\n\r\n#ifdef USE_LOGDEPTHBUF\r\n#ifdef USE_LOGDEPTHBUF_EXT\r\nvarying float vFragDepth;\r\n#endif\r\nuniform float logDepthBufFC;\r\n#endif\r\n\r\n#ifdef MRT_NORMALS\r\nvarying float depth;\r\n#endif\r\n\r\n#include<pack_normals>\r\n#include<instancing_decl_vert>\r\n#include<id_decl_vert>\r\n#include<wide_lines_decl>\r\n\r\n#include<shadowmap_decl_vert>\r\n\r\nvoid main() {\r\n\r\n#if defined( USE_MAP ) || defined( USE_SPECULARMAP )\r\n    vUv = (texMatrix * vec3(uv, 1.0)).xy;\r\n#endif\r\n\r\n#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP )\r\n    vUvBump = (texMatrixBump * vec3(uv, 1.0)).xy;\r\n#endif\r\n\r\n#if defined( USE_ALPHAMAP )\r\n    vUvAlpha = (texMatrixAlpha * vec3(uv, 1.0)).xy;\r\n#endif\r\n\r\n\r\n#ifdef USE_COLOR\r\n#ifdef GAMMA_INPUT\r\n    vColor = color * color;\r\n#else\r\n    vColor = color;\r\n#endif\r\n#endif\r\n\r\n#ifdef UNPACK_NORMALS\r\n    vec3 objectNormal = decodeNormal(normal);\r\n#else\r\n    vec3 objectNormal = normal;\r\n#endif\r\n\r\n#ifdef FLIP_SIDED\r\n    objectNormal = -objectNormal;\r\n#endif\r\n\r\n\r\n    objectNormal = getInstanceNormal(objectNormal);\r\n    vec3 instPos = getInstancePos(position);\r\n\r\n    vec3 transformedNormal = normalMatrix * objectNormal;\r\n\r\n#ifndef FLAT_SHADED\r\n    vNormal = normalize( transformedNormal );\r\n#endif\r\n\r\n    vec4 mvPosition = modelViewMatrix * vec4( instPos, 1.0 );\r\n\r\n    gl_Position = projectionMatrix * mvPosition;\r\n\r\n#include<wide_lines_vert>\r\n\r\n    vViewPosition = -mvPosition.xyz;\r\n\r\n#if MAX_SPOT_LIGHTS > 0 || NUM_CUTPLANES > 0\r\n    vec4 worldPosition = modelMatrix * vec4( instPos, 1.0 );\r\n    vWorldPosition = worldPosition.xyz;\r\n#endif\r\n\r\n\r\n#ifdef USE_LOGDEPTHBUF\r\n    if (projectionMatrix[3][3] == 0.0) {\r\n        gl_Position.z = log2(max(1.0e-6, gl_Position.w + 1.0)) * logDepthBufFC;\r\n#ifdef USE_LOGDEPTHBUF_EXT\r\n        vFragDepth = 1.0 + gl_Position.w;\r\n#else\r\n        gl_Position.z = (gl_Position.z - 1.0) * gl_Position.w;\r\n#endif\r\n    } else {\r\n\r\n#ifdef USE_LOGDEPTHBUF_EXT\r\n        vFragDepth = 1.0 + vViewPosition.z;\r\n#else\r\n\r\n#endif\r\n    }\r\n#endif\r\n\r\n#ifdef MRT_NORMALS\r\n    depth = mvPosition.z;\r\n#endif\r\n\r\n#include<shadowmap_vert>\r\n#include<id_vert>\r\n}\r\n"
    },
    function(a, b) {
        a.exports = "uniform vec3 diffuse;\r\nuniform float opacity;\r\n\r\nuniform vec3 emissive;\r\nuniform vec3 specular;\r\nuniform float shininess;\r\n\r\n#include<env_sample>\r\n\r\n#ifdef USE_COLOR\r\nvarying vec3 vColor;\r\n#endif\r\n\r\n#ifdef GAMMA_INPUT\r\nvec3 InputToLinear(vec3 c) {\r\n    return c * c;\r\n}\r\nfloat InputToLinear(float c) {\r\n    return c * c;\r\n}\r\n#else\r\nvec3 InputToLinear(vec3 c) {\r\n    return c;\r\n}\r\nfloat InputToLinear(float c) {\r\n    return c;\r\n}\r\n#endif\r\n\r\n#if defined( USE_MAP ) || defined( USE_SPECULARMAP )\r\nvarying vec2 vUv;\r\n#endif\r\n\r\n#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP )\r\nvarying vec2 vUvBump;\r\n#endif\r\n\r\n#if defined( USE_ALPHAMAP )\r\nvarying vec2 vUvAlpha;\r\n#endif\r\n\r\n#ifdef USE_MAP\r\nuniform sampler2D map;\r\n#endif\r\n\r\n#if TONEMAP_OUTPUT > 0\r\nuniform float exposureBias;\r\n#include<tonemap>\r\n#endif\r\n\r\n#if defined(IRR_RGBM) || defined(ENV_RGBM) || defined(ENV_GAMMA) || defined(IRR_GAMMA)\r\nuniform float envMapExposure;\r\n#endif\r\n\r\n#ifdef USE_FOG\r\nuniform vec3 fogColor;\r\nuniform float fogNear;\r\nuniform float fogFar;\r\n#endif\r\n#include<id_decl_frag>\r\n#include<theming_decl_frag>\r\n#include<shadowmap_decl_frag>\r\n\r\n#ifdef USE_ENVMAP\r\n\r\nuniform float reflMipIndex;\r\n\r\nuniform float reflectivity;\r\nuniform samplerCube envMap;\r\n\r\n#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP )\r\n\r\nuniform float refractionRatio;\r\n\r\n#endif\r\n\r\nvec3 sampleReflection(vec3 dir, float mipIndex) {\r\n\r\n    vec3 adjDir = adjustLookupVector(dir);\r\n\r\n#ifdef ENV_GAMMA\r\n\r\n#ifdef HAVE_TEXTURE_LOD\r\n    vec4 envTexColor = textureCubeLodEXT( envMap, adjDir, mipIndex );\r\n#else\r\n\r\n\r\n    vec4 envTexColor = textureCube( envMap, adjDir, mipIndex );\r\n#endif\r\n\r\n    return GammaDecode(envTexColor, envMapExposure);\r\n\r\n#elif defined(ENV_RGBM)\r\n\r\n#ifdef HAVE_TEXTURE_LOD\r\n    vec4 envTexColor = textureCubeLodEXT( envMap, adjDir, mipIndex );\r\n#else\r\n\r\n\r\n    vec4 envTexColor = textureCube( envMap, adjDir, mipIndex );\r\n#endif\r\n\r\n    return RGBMDecode(envTexColor, envMapExposure);\r\n\r\n#else\r\n\r\n\r\n\r\n    vec4 envTexColor = textureCube( envMap, adjDir );\r\n    vec3 cubeColor = envTexColor.xyz;\r\n\r\n#ifdef GAMMA_INPUT\r\n    cubeColor *= cubeColor;\r\n#endif\r\n\r\n    return cubeColor;\r\n\r\n#endif\r\n\r\n}\r\n\r\n#endif\r\n\r\n\r\nuniform vec3 ambientLightColor;\r\n\r\n#if MAX_DIR_LIGHTS > 0\r\n\r\nuniform vec3 directionalLightColor[ MAX_DIR_LIGHTS ];\r\nuniform vec3 directionalLightDirection[ MAX_DIR_LIGHTS ];\r\n\r\n#endif\r\n\r\n#if MAX_POINT_LIGHTS > 0\r\n\r\nuniform vec3 pointLightColor[ MAX_POINT_LIGHTS ];\r\n\r\nuniform vec3 pointLightPosition[ MAX_POINT_LIGHTS ];\r\nuniform float pointLightDistance[ MAX_POINT_LIGHTS ];\r\n\r\n#endif\r\n\r\n#if MAX_SPOT_LIGHTS > 0\r\n\r\nuniform vec3 spotLightColor[ MAX_SPOT_LIGHTS ];\r\nuniform vec3 spotLightPosition[ MAX_SPOT_LIGHTS ];\r\nuniform vec3 spotLightDirection[ MAX_SPOT_LIGHTS ];\r\nuniform float spotLightAngleCos[ MAX_SPOT_LIGHTS ];\r\nuniform float spotLightExponent[ MAX_SPOT_LIGHTS ];\r\n\r\nuniform float spotLightDistance[ MAX_SPOT_LIGHTS ];\r\n\r\n#endif\r\n\r\n#ifdef USE_IRRADIANCEMAP\r\nuniform samplerCube irradianceMap;\r\n#endif\r\n\r\n#if MAX_SPOT_LIGHTS > 0 || NUM_CUTPLANES > 0\r\nvarying highp vec3 vWorldPosition;\r\n#endif\r\n\r\nvarying highp vec3 vViewPosition;\r\n#ifndef FLAT_SHADED\r\nvarying highp vec3 vNormal;\r\n#endif\r\n\r\n#ifdef USE_BUMPMAP\r\n\r\nuniform sampler2D bumpMap;\r\nuniform float bumpScale;\r\n\r\n\r\n\r\n\r\n\r\n\r\nvec2 dHdxy_fwd() {\r\n\r\n    vec2 dSTdx = dFdx( vUvBump );\r\n    vec2 dSTdy = dFdy( vUvBump );\r\n\r\n    float Hll = bumpScale * GET_BUMPMAP(vUvBump).x;\r\n    float dBx = bumpScale * GET_BUMPMAP(vUvBump + dSTdx).x - Hll;\r\n    float dBy = bumpScale * GET_BUMPMAP(vUvBump + dSTdy).x - Hll;\r\n\r\n    return vec2( dBx, dBy );\r\n\r\n}\r\n\r\nvec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy ) {\r\n\r\n    vec3 vSigmaX = dFdx( surf_pos );\r\n    vec3 vSigmaY = dFdy( surf_pos );\r\n    vec3 vN = surf_norm;\r\n\r\n    vec3 R1 = cross( vSigmaY, vN );\r\n    vec3 R2 = cross( vN, vSigmaX );\r\n\r\n    float fDet = dot( vSigmaX, R1 );\r\n\r\n    vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );\r\n    return normalize( abs( fDet ) * surf_norm - vGrad );\r\n\r\n}\r\n\r\n#endif\r\n\r\n\r\n#ifdef USE_NORMALMAP\r\n\r\nuniform sampler2D normalMap;\r\nuniform vec2 normalScale;\r\n\r\n\r\n\r\n\r\nvec3 perturbNormal2Arb( vec3 eye_pos, vec3 surf_norm ) {\r\n\r\n    vec3 q0 = dFdx( eye_pos.xyz );\r\n    vec3 q1 = dFdy( eye_pos.xyz );\r\n    vec2 st0 = dFdx( vUvBump.st );\r\n    vec2 st1 = dFdy( vUvBump.st );\r\n\r\n    vec3 S = normalize(  q0 * st1.t - q1 * st0.t );\r\n    vec3 T = normalize( -q0 * st1.s + q1 * st0.s );\r\n    vec3 N = normalize( surf_norm );\r\n\r\n    vec3 mapN = GET_NORMALMAP(vUvBump).xyz * 2.0 - 1.0;\r\n    mapN.xy = normalScale * mapN.xy;\r\n    mat3 tsn = mat3( S, T, N );\r\n    return normalize( tsn * mapN );\r\n\r\n}\r\n\r\n#endif\r\n\r\n\r\n#ifdef USE_SPECULARMAP\r\nuniform sampler2D specularMap;\r\n#endif\r\n\r\n#ifdef USE_ALPHAMAP\r\nuniform sampler2D alphaMap;\r\n#endif\r\n\r\n#include<hatch_pattern>\r\n\r\n#ifdef USE_LOGDEPTHBUF\r\nuniform float logDepthBufFC;\r\n#ifdef USE_LOGDEPTHBUF_EXT\r\n#extension GL_EXT_frag_depth : enable\r\nvarying highp float vFragDepth;\r\n#endif\r\n#endif\r\n\r\nvec3 Schlick_v3(vec3 v, float cosHV) {\r\n    float facing = max(1.0 - cosHV, 0.0);\r\n    float facing2 = facing * facing;\r\n    return v + (1.0 - v) * facing * facing2 * facing2;\r\n}\r\n\r\nfloat Schlick_f(float v, float cosHV) {\r\n    float facing = max(1.0 - cosHV, 0.0);\r\n    float facing2 = facing * facing;\r\n    return v + ( 1.0 - v ) * facing2 * facing2 * facing;\r\n}\r\n\r\n#include<cutplanes>\r\n\r\nvoid main() {\r\n\r\n#if NUM_CUTPLANES > 0\r\n    checkCutPlanes(vWorldPosition);\r\n#endif\r\n\r\n    gl_FragColor = vec4( vec3 ( 1.0 ), opacity );\r\n\r\n#ifdef USE_MAP\r\n    vec4 texelColor = GET_MAP(vUv);\r\n#ifdef MAP_INVERT\r\n    texelColor.xyz = 1.0-texelColor.xyz;\r\n#endif\r\n#ifdef GAMMA_INPUT\r\n    texelColor.xyz *= texelColor.xyz;\r\n#endif\r\n    gl_FragColor = gl_FragColor * texelColor;\r\n#endif\r\n\r\n#ifdef USE_ALPHAMAP\r\n    vec4 texelAlpha = GET_ALPHAMAP(vUvAlpha);\r\n    gl_FragColor.a *= texelAlpha.r;\r\n#endif\r\n\r\n#ifdef ALPHATEST\r\n    if ( gl_FragColor.a < ALPHATEST ) discard;\r\n#endif\r\n\r\n    float specularStrength;\r\n\r\n#ifdef USE_SPECULARMAP\r\n    vec4 texelSpecular = GET_SPECULARMAP(vUv);\r\n    specularStrength = texelSpecular.r;\r\n#else\r\n    specularStrength = 1.0;\r\n#endif\r\n\r\n#ifndef FLAT_SHADED\r\n    vec3 normal = normalize( vNormal );\r\n#ifdef DOUBLE_SIDED\r\n    normal = normal * ( -1.0 + 2.0 * float( gl_FrontFacing ) );\r\n#endif\r\n#else\r\n    vec3 fdx = dFdx( vViewPosition );\r\n    vec3 fdy = dFdy( vViewPosition );\r\n    vec3 normal = normalize( cross( fdx, fdy ) );\r\n#endif\r\n\r\n    vec3 geomNormal = normal;\r\n\r\n#ifdef USE_NORMALMAP\r\n    normal = perturbNormal2Arb( -vViewPosition, normal );\r\n#elif defined( USE_BUMPMAP )\r\n    normal = perturbNormalArb( -vViewPosition, normal, dHdxy_fwd() );\r\n#endif\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n    vec3 viewDirection;\r\n    if (projectionMatrix[3][3] == 0.0) {\r\n        viewDirection = normalize( vViewPosition );\r\n    } else {\r\n        viewDirection = vec3(0.0, 0.0, 1.0);\r\n    }\r\n\r\n    vec3 totalDiffuse = vec3( 0.0 );\r\n    vec3 totalSpecular = vec3( 0.0 );\r\n\r\n\r\n\r\n    float shininessB = shininess * 4.0;\r\n\r\n#if MAX_POINT_LIGHTS > 0\r\n\r\n    vec3 pointDiffuse  = vec3( 0.0 );\r\n    vec3 pointSpecular = vec3( 0.0 );\r\n\r\n    for ( int i = 0; i < MAX_POINT_LIGHTS; i ++ ) {\r\n\r\n        vec4 lPosition = viewMatrix * vec4( pointLightPosition[ i ], 1.0 );\r\n        vec3 lVector = lPosition.xyz + vViewPosition.xyz;\r\n\r\n        float lDistance = 1.0;\r\n        if ( pointLightDistance[ i ] > 0.0 )\r\n            lDistance = 1.0 - min( ( length( lVector ) / pointLightDistance[ i ] ), 1.0 );\r\n\r\n        lVector = normalize( lVector );\r\n\r\n\r\n\r\n        float dotProduct = dot( normal, lVector );\r\n\r\n        float pointDiffuseWeight = max( dotProduct, 0.0 );\r\n\r\n\r\n        pointDiffuse  += InputToLinear(diffuse) * InputToLinear(pointLightColor[ i ]) * pointDiffuseWeight * lDistance;\r\n\r\n\r\n\r\n        vec3 pointHalfVector = normalize( lVector + viewDirection );\r\n        float pointDotNormalHalf = max( dot( normal, pointHalfVector ), 0.0 );\r\n\r\n        float pointSpecularWeight = specularStrength * max( pow( pointDotNormalHalf, shininessB ), 0.0 );\r\n        float specularNormalization = shininessB * 0.125 + 0.25;\r\n        vec3 schlick = Schlick_v3(InputToLinear(specular), dot( lVector, pointHalfVector ) );\r\n        pointSpecular += schlick * InputToLinear(pointLightColor[ i ]) * pointSpecularWeight * pointDiffuseWeight * lDistance * specularNormalization ;\r\n\r\n    }\r\n\r\n    totalDiffuse += pointDiffuse;\r\n    totalSpecular += pointSpecular;\r\n\r\n#endif\r\n\r\n#if MAX_SPOT_LIGHTS > 0\r\n\r\n    vec3 spotDiffuse  = vec3( 0.0 );\r\n    vec3 spotSpecular = vec3( 0.0 );\r\n\r\n    for ( int i = 0; i < MAX_SPOT_LIGHTS; i ++ ) {\r\n\r\n        vec4 lPosition = viewMatrix * vec4( spotLightPosition[ i ], 1.0 );\r\n        vec3 lVector = lPosition.xyz + vViewPosition.xyz;\r\n\r\n        float lDistance = 1.0;\r\n        if ( spotLightDistance[ i ] > 0.0 )\r\n            lDistance = 1.0 - min( ( length( lVector ) / spotLightDistance[ i ] ), 1.0 );\r\n\r\n        lVector = normalize( lVector );\r\n\r\n        float spotEffect = dot( spotLightDirection[ i ], normalize( spotLightPosition[ i ] - vWorldPosition ) );\r\n\r\n        if ( spotEffect > spotLightAngleCos[ i ] ) {\r\n\r\n            spotEffect = max( pow( spotEffect, spotLightExponent[ i ] ), 0.0 );\r\n\r\n\r\n\r\n            float dotProduct = dot( normal, lVector );\r\n\r\n            float spotDiffuseWeight = max( dotProduct, 0.0 );\r\n\r\n            spotDiffuse += InputToLinear(diffuse) * InputToLinear(spotLightColor[ i ]) * spotDiffuseWeight * lDistance * spotEffect;\r\n\r\n\r\n\r\n            vec3 spotHalfVector = normalize( lVector + viewDirection );\r\n            float spotDotNormalHalf = max( dot( normal, spotHalfVector ), 0.0 );\r\n            float spotSpecularWeight = specularStrength * max( pow( spotDotNormalHalf, shininessB ), 0.0 );\r\n\r\n            float specularNormalization = shininessB * 0.125 + 0.25;\r\n            vec3 schlick = Schlick_v3(InputToLinear(specular), dot( lVector, spotHalfVector ) );\r\n            spotSpecular += schlick * InputToLinear(spotLightColor[ i ]) * spotSpecularWeight * spotDiffuseWeight * lDistance * specularNormalization * spotEffect;\r\n        }\r\n\r\n    }\r\n\r\n    totalDiffuse += spotDiffuse;\r\n    totalSpecular += spotSpecular;\r\n\r\n#endif\r\n\r\n#if MAX_DIR_LIGHTS > 0\r\n\r\n    vec3 dirDiffuse  = vec3( 0.0 );\r\n    vec3 dirSpecular = vec3( 0.0 );\r\n\r\n    for( int i = 0; i < MAX_DIR_LIGHTS; i ++ ) {\r\n\r\n        vec4 lDirection = viewMatrix * vec4( directionalLightDirection[ i ], 0.0 );\r\n        vec3 dirVector = normalize( lDirection.xyz );\r\n\r\n\r\n\r\n        float dotProduct = dot( normal, dirVector );\r\n\r\n        float dirDiffuseWeight = max( dotProduct, 0.0 );\r\n\r\n        dirDiffuse  += InputToLinear(diffuse) * InputToLinear(directionalLightColor[ i ]) * dirDiffuseWeight;\r\n\r\n\r\n\r\n        vec3 dirHalfVector = normalize( dirVector + viewDirection );\r\n        float dirDotNormalHalf = max( dot( normal, dirHalfVector ), 0.0 );\r\n        float dirSpecularWeight = specularStrength * max( pow( dirDotNormalHalf, shininessB ), 0.0 );\r\n\r\n        float specularNormalization = shininessB * 0.125 + 0.25;\r\n        vec3 schlick = Schlick_v3(InputToLinear(specular), dot( dirVector, dirHalfVector ));\r\n\r\n        dirSpecular += schlick * InputToLinear(directionalLightColor[ i ]) * dirSpecularWeight * dirDiffuseWeight * specularNormalization;\r\n\r\n    }\r\n\r\n    totalDiffuse += dirDiffuse;\r\n    totalSpecular += dirSpecular;\r\n\r\n#endif\r\n\r\n\r\n\r\n#ifdef USE_IRRADIANCEMAP\r\n    vec3 worldNormal = mat3(viewMatrixInverse) * normal;\r\n    vec3 indirectDiffuse = sampleIrradianceMap(worldNormal, irradianceMap, envMapExposure);\r\n\r\n    indirectDiffuse = applyEnvShadow(indirectDiffuse, worldNormal);\r\n\r\n    totalDiffuse += InputToLinear(diffuse) * indirectDiffuse;\r\n#endif\r\n\r\n\r\n#ifdef METAL\r\n    gl_FragColor.xyz = gl_FragColor.xyz * ( InputToLinear(emissive) + totalDiffuse + ambientLightColor * InputToLinear(diffuse) + totalSpecular );\r\n#else\r\n    gl_FragColor.xyz = gl_FragColor.xyz * ( InputToLinear(emissive) + totalDiffuse + ambientLightColor * InputToLinear(diffuse) ) + totalSpecular;\r\n#endif\r\n\r\n\r\n\r\n#ifdef USE_COLOR\r\n    gl_FragColor = gl_FragColor * vec4( vColor, 1.0 );\r\n#endif\r\n\r\n\r\n#if defined(USE_ENVMAP)\r\n\r\n    vec3 reflectVec;\r\n\r\n#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP )\r\n\r\n#ifdef ENVMAP_MODE_REFLECTION\r\n    reflectVec = reflect( -viewDirection, normal );\r\n#else \r\n    reflectVec = refract( -viewDirection, normal, refractionRatio );\r\n#endif\r\n\r\n#else\r\n\r\n    reflectVec = reflect( -viewDirection, normal );\r\n\r\n#endif\r\n\r\n    reflectVec = mat3(viewMatrixInverse) * reflectVec;\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n    float reflectScale = 1.0;\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n    vec3 cubeColor = sampleReflection(reflectVec, reflMipIndex);\r\n\r\n    cubeColor *= reflectScale;\r\n\r\n    float facing = dot( viewDirection, geomNormal );\r\n\r\n\r\n\r\n\r\n\r\n    if (facing < -1e-2)\r\n        facing = 1.0;\r\n    else\r\n        facing = max(1e-6, facing);\r\n\r\n    vec3 schlickRefl;\r\n\r\n#ifdef METAL\r\n\r\n\r\n    schlickRefl = InputToLinear(specular);\r\n\r\n#else\r\n\r\n\r\n    schlickRefl = Schlick_v3(InputToLinear(specular), facing);\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n    gl_FragColor.a = mix(gl_FragColor.a, Schlick_f(gl_FragColor.a, facing), reflectivity);\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n    float invSchlick = (1.0 - facing * 0.5);\r\n    float invSchlick2 = invSchlick * invSchlick;\r\n    float norm_factor = 1.0 - invSchlick * invSchlick2 * invSchlick2;\r\n\r\n\r\n    norm_factor = (28.0 / 23.0) * norm_factor;\r\n\r\n    gl_FragColor.xyz *= norm_factor * (1.0 - InputToLinear(specular));\r\n\r\n#endif\r\n\r\n\r\n    gl_FragColor.xyz += cubeColor.xyz * specularStrength * schlickRefl.xyz;\r\n\r\n#ifdef CLEARCOAT\r\n\r\n    vec3 reflectVecClearcoat = reflect( -viewDirection, geomNormal );\r\n    reflectVecClearcoat = mat3(viewMatrixInverse) * reflectVecClearcoat;\r\n\r\n    vec3 cubeColorClearcoat = sampleReflection(reflectVecClearcoat, 0.0);\r\n\r\n\r\n    float schlickClearcoat = Schlick_f(InputToLinear(reflectivity), facing);\r\n\r\n\r\n\r\n    gl_FragColor.xyz = mix(gl_FragColor.xyz, cubeColorClearcoat * schlickClearcoat, 0.5);\r\n\r\n#endif\r\n\r\n\r\n\r\n\r\n#endif\r\n\r\n#if TONEMAP_OUTPUT == 1\r\n    gl_FragColor.xyz = toneMapCanonOGS_WithGamma_WithColorPerserving(exposureBias * gl_FragColor.xyz);\r\n#elif TONEMAP_OUTPUT == 2\r\n    gl_FragColor.xyz = toneMapCanonFilmic_WithGamma( exposureBias * gl_FragColor.xyz );\r\n#endif\r\n\r\n\r\n\r\n#ifdef USE_FOG\r\n    float depth = gl_FragCoord.z / gl_FragCoord.w;\r\n    float fogFactor = smoothstep( fogNear, fogFar, depth );\r\n    gl_FragColor = mix( gl_FragColor, vec4( fogColor, gl_FragColor.w ), fogFactor );\r\n#endif\r\n#include<theming_frag>\r\n#include<final_frag>\r\n\r\n}\r\n"
    },
    function(a, b) {
        "use strict";
        function c(a) {
            return a.vb ? a.vb.length / a.vbstride: a.attributes.positions ? a.attributes.positions.count: 0
        }
        function d(a, b, c) {
            var d, e = a.attributes,
                f = a.vb || e.position.array,
                h = a.vb ? a.vbstride: 3;
            if (a.vblayout) {
                if (!a.vblayout.position) return;
                d = a.vblayout.position.offset
            } else {
                if (!e.position) return;
                d = e.position.itemOffset || 0
            }
            var i = f.length / h;
            g || (g = new p);
            for (var j = d,
                     k = 0; k < i; k++, j += h) g.set(f[j], f[j + 1], f[j + 2]),
            c && g.applyMatrix4(c),
                b(g, k)
        }
        function e(a, b) {
            var c, d, e, f = a.attributes;
            h || (h = new p, i = new p, j = new p, k = new p, l = new p, m = new p);
            var g, n = a.vb || f.position.array,
                o = a.vb || f.normal && f.normal.array,
                q = a.vb ? a.vbstride: 3;
            if (a.vblayout) {
                if (!a.vblayout.position) return;
                g = a.vblayout.position.offset
            } else {
                if (!f.position) return;
                g = f.position.itemOffset || 0
            }
            var r = 0,
                s = a.vblayout ? a.vblayout.normal: f.normal || null;
            s ? r = s.offset || s.itemOffset: o = null,
            !s || 3 === s.itemSize && 4 === s.bytesPerItem || (o = null);
            var t = a.ib || a.indices || (f.index ? f.index.array: null);
            if (t) {
                var u = a.offsets;
                u && 0 !== u.length || (u = [{
                    start: 0,
                    count: t.length,
                    index: 0
                }]);
                for (var v = 0,
                         w = u.length; v < w; ++v) for (var x = u[v].start, y = u[v].count, z = u[v].index, A = x, B = x + y; A < B; A += 3) {
                    c = z + t[A],
                        d = z + t[A + 1],
                        e = z + t[A + 2];
                    var C = c * q + g,
                        D = d * q + g,
                        E = e * q + g;
                    if (h.x = n[C], h.y = n[C + 1], h.z = n[C + 2], i.x = n[D], i.y = n[D + 1], i.z = n[D + 2], j.x = n[E], j.y = n[E + 1], j.z = n[E + 2], o) {
                        var F = c * q + r,
                            G = d * q + r,
                            H = e * q + r;
                        k.x = o[F],
                            k.y = o[F + 1],
                            k.z = o[F + 2],
                            l.x = o[G],
                            l.y = o[G + 1],
                            l.z = o[G + 2],
                            m.x = o[H],
                            m.y = o[H + 1],
                            m.z = o[H + 2],
                            b(h, i, j, c, d, e, k, l, m)
                    } else b(h, i, j, c, d, e)
                }
            } else for (var I = a.vb ? a.vb.length / a.vbstride: n.length / 3, A = 0; A < I; A++) {
                c = 3 * A,
                    d = 3 * A + 1,
                    e = 3 * A + 2;
                var C = c * q + g,
                    D = d * q + g,
                    E = e * q + g;
                if (h.x = n[C], h.y = n[C + 1], h.z = n[C + 2], i.x = n[D], i.y = n[D + 1], i.z = n[D + 2], j.x = n[E], j.y = n[E + 1], j.z = n[E + 2], o) {
                    var F = c * q + r,
                        G = d * q + r,
                        H = e * q + r;
                    k.x = o[F],
                        k.y = o[F + 1],
                        k.z = o[F + 2],
                        l.x = o[G],
                        l.y = o[G + 1],
                        l.z = o[G + 2],
                        m.x = o[H],
                        m.y = o[H + 1],
                        m.z = o[H + 2],
                        b(h, i, j, c, d, e, k, l, m)
                } else b(h, i, j, c, d, e)
            }
        }
        function f(a, b) {
            var c, d, e = a.attributes;
            n || (n = new p, o = new p);
            var f = 2;
            a.lineWidth && (f = 6);
            var f = 2;
            a.lineWidth && (f = 6);
            var g = a.ib || a.indices || (e.index ? e.index.array: null);
            if (g) {
                var h = a.vb ? a.vb: e.position.array,
                    i = a.vb ? a.vbstride: 3,
                    j = a.offsets;
                j && 0 !== j.length || (j = [{
                    start: 0,
                    count: g.length,
                    index: 0
                }]);
                for (var k = 0,
                         l = j.length; k < l; ++k) for (var m = j[k].start, q = j[k].count, r = j[k].index, s = m, t = m + q; s < t; s += f) c = r + g[s],
                    d = r + g[s + 1],
                    n.x = h[c * i],
                    n.y = h[c * i + 1],
                    n.z = h[c * i + 2],
                    o.x = h[d * i],
                    o.y = h[d * i + 1],
                    o.z = h[d * i + 2],
                    b(n, o, c, d)
            } else for (var h = a.vb ? a.vb: e.position.array, i = a.vb ? a.vbstride: 3, s = 0, t = h.length; s < t; s += f) c = s,
                d = s + 1,
                n.x = h[c * i],
                n.y = h[c * i + 1],
                n.z = h[c * i + 2],
                o.x = h[d * i],
                o.y = h[d * i + 1],
                o.z = h[d * i + 2],
                b(n, o, c, d)
        }
        var g, h, i, j, k, l, m, n, o, p = "undefined" != typeof self && self.LmvVector3 ? self.LmvVector3: THREE.Vector3;
        a.exports = {
            getVertexCount: c,
            enumMeshVertices: d,
            enumMeshTriangles: e,
            enumMeshLines: f
        }
    },
    function(a, b, c) {
        "use strict";
        function d(a, b) {
            function c(a, b) {
                var c = 0 | a.x * k,
                    d = 0 | a.y * k,
                    e = 0 | a.z * k,
                    g = f[c];
                g || (f[c] = g = {});
                var h = g[d];
                h || (g[d] = h = {});
                var i = h[e];
                return void 0 === i && (h[e] = i = b),
                    i
            }
            function d(a, b) {
                var d = c(a, b);
                e[b] = d
            }
            var e = [],
                f = {},
                g = 1;
            if (a.boundingBox || b) {
                var h = (new l).copy(a.boundingBox || b),
                    i = h.size();
                g = Math.max(i.x, Math.max(i.y, i.z))
            }
            var k = 65536 / g;
            return j(a, d),
                e
        }
        function e(a, b) {
            function c(a, b) {
                d[3 * b] = a.x,
                    d[3 * b + 1] = a.y,
                    d[3 * b + 2] = a.z
            }
            var d = new Float32Array(3 * h(a));
            return j(a, c, b),
                d
        }
        function f(a, b, c, f) {
            function g(a, b) {
                b.x = n[3 * a],
                    b.y = n[3 * a + 1],
                    b.z = n[3 * a + 2]
            }
            function h(a, b, c, d) {
                g(a, q),
                    g(b, r),
                    g(c, s),
                    r.sub(q),
                    s.sub(q),
                    r.cross(s),
                    d.copy(r).normalize()
            }
            function j(a, b, c) {
                var d = m[a],
                    e = m[b],
                    g = m[c];
                if (d !== e && d !== g && e !== g) {
                    var i = !1;
                    if (d > e) {
                        var j = d;
                        d = e,
                            e = j,
                            i = !0
                    }
                    var k = o[d];
                    if (k) {
                        var l = k[e];
                        if (void 0 === l) k[e] = i ? -c - 1 : c;
                        else {
                            if (f) p.push(a),
                                p.push(b);
                            else {
                                h(a, b, c, t),
                                    l < 0 ? h(e, d, m[ - l - 1], u) : h(d, e, m[l], u);
                                var n = t.dot(u);
                                Math.abs(n) < .25 && (p.push(a), p.push(b))
                            }
                            delete k[e]
                        }
                    } else o[d] = {},
                        o[d][e] = c
                }
            }
            function l(a, b, c, d, e, f) {
                j(d, e, f),
                    j(e, f, d),
                    j(f, d, e)
            }
            if (!a.isLines && !a.iblines) {
                var m = d(a, c),
                    n = e(a, b),
                    o = {},
                    p = [],
                    q = new k,
                    r = new k,
                    s = new k,
                    t = new k,
                    u = new k;
                i(a, l);
                for (var v in o) for (var w in o[v]) p.push(parseInt(v)),
                    p.push(parseInt(w));
                p.length > 1 && (a.iblines = new Uint16Array(p.length), a.iblines.set(p))
            }
        }
        var g = c(78),
            h = g.getVertexCount,
            i = g.enumMeshTriangles,
            j = g.enumMeshVertices,
            k = "undefined" != typeof self && self.LmvVector3 ? self.LmvVector3: THREE.Vector3,
            l = "undefined" != typeof self && self.LmvBox3 ? self.LmvBox3: THREE.Box3;
        a.exports = {
            createWireframe: f
        }
    },
    function(a, b, c) {
        "use strict";
        function d() {
            k || (k = new THREE.Matrix4, l = new THREE.Ray, m = new THREE.Vector3, n = new THREE.Vector3, o = new THREE.Vector3)
        }
        function e(a, b, c) {
            d();
            var e = a.geometry;
            if (e) {
                var f = a.material,
                    g = f ? f.side: THREE.FrontSide;
                k.getInverse(a.matrixWorld),
                    l.copy(b.ray).applyMatrix4(k);
                var h, i, j = b.precision;
                p.enumMeshTriangles(e,
                    function(d, e, f, k, m, n) {
                        null !== (h = g === THREE.BackSide ? l.intersectTriangle(f, e, d, !0) : l.intersectTriangle(d, e, f, g !== THREE.DoubleSide)) && (h.applyMatrix4(a.matrixWorld), (i = b.ray.origin.distanceTo(h)) < j || i < b.near || i > b.far || c.push({
                            distance: i,
                            point: h,
                            face: new THREE.Face3(k, m, n, THREE.Triangle.normal(d, e, f)),
                            faceIndex: null,
                            fragId: a.fragId,
                            dbId: a.dbId
                        }))
                    })
            }
        }
        function f(a, b, c) {
            d();
            var e = a.geometry;
            if (e) {
                var f = b.linePrecision;
                a.isWideLine && a.geometry.lineWidth && (f = a.geometry.lineWidth);
                var g = f * f;
                k.getInverse(a.matrixWorld),
                    l.copy(b.ray).applyMatrix4(k);
                var h = new THREE.Vector3,
                    i = new THREE.Vector3;
                e instanceof THREE.BufferGeometry && p.enumMeshLines(e,
                    function(d, e) {
                        var f;
                        if (! (l.distanceSqToSegment(d, e, i, h) > g)) {
                            var j = h.clone().applyMatrix4(a.matrixWorld);
                            f = b.ray.origin.distanceTo(j),
                            f < b.near || f > b.far || c.push({
                                distance: f,
                                point: j,
                                face: null,
                                faceIndex: null,
                                fragId: a.fragId,
                                dbId: a.dbId
                            })
                        }
                    })
            }
        }
        function g(a, b, c) {
            d();
            var e = a.geometry;
            if (e) {
                k.getInverse(a.matrixWorld),
                    l.copy(b.ray).applyMatrix4(k);
                var f = b.precision,
                    g = b.params.PointCloud.threshold;
                g || (g = 1),
                    g *= Math.max(3, e.pointSize),
                    g /= 4,
                e instanceof THREE.BufferGeometry && p.enumMeshVertices(e,
                    function(d) {
                        if (! (l.distanceToPoint(d) > g)) {
                            var e = l.closestPointToPoint(d);
                            if (null !== e) {
                                e.applyMatrix4(a.matrixWorld);
                                var h = b.ray.origin.distanceTo(e);
                                h < f || h < b.near || h > b.far || c.push({
                                    distance: h,
                                    point: d,
                                    face: null,
                                    faceIndex: null,
                                    fragId: a.fragId,
                                    dbId: a.dbId
                                })
                            }
                        }
                    })
            }
        }
        function h(a, b, c) {
            a.isLine || a.isWideLine ? f(a, b, c) : a.isPoint ? g(a, b, c) : e(a, b, c)
        }
        function i(a, b, c, d) {
            if (a instanceof THREE.Mesh ? h(a, b, c) : a.raycast(b, c), !0 === d) for (var e = a.children,
                                                                                           f = 0,
                                                                                           g = e.length; f < g; f++) i(e[f], b, c, !0)
        }
        function j(a, b, c, d) {
            i(a, b, c, d),
                c.sort(q)
        }
        var k, l, m, n, o, p = c(78),
            q = function(a, b) {
                return a.distance - b.distance
            };
        a.exports = {
            meshRayCast: e,
            lineRayCast: f,
            rayCast: h,
            intersectObject: j
        }
    },
    function(a, b, c) {
        "use strict";
        function d(a, b, c) {
            this.geoms = [null],
                this.numGeomsInMemory = 0,
                this.geomMemory = 0,
                this.gpuMeshMemory = 0,
                this.gpuNumMeshes = 0,
                this.geomPolyCount = 0,
                this.instancePolyCount = 0,
                this.is2d = b,
                this.geomBoxes = new Float32Array(6 * Math.max(1, a + 1)),
                this.disableStreaming = !!c
        }
        var e = c(71);
        d.prototype.getGeometry = function(a) {
            return this.geoms[a]
        },
            d.prototype.chooseMemoryType = function(a, b, c, d) {
                var f = e.GPU_MEMORY_LIMIT,
                    g = 2 * f,
                    h = e.GPU_OBJECT_LIMIT;
                if (this.isf2d && (g *= 2), this.disableStreaming || d < f && c < h) a.streamingDraw = !1,
                    a.streamingIndex = !1;
                else if (d >= g) a.streamingDraw = !0,
                    a.streamingIndex = !0;
                else {
                    var i;
                    i = this.is2d ? 100001 : a.byteSize * (b || 1),
                    i < 1e5 && (a.streamingDraw = !0, a.streamingIndex = !0)
                }
            },
            d.prototype.addGeometry = function(a, b, c) {
                this.chooseMemoryType(a, b, this.gpuNumMeshes, this.gpuMeshMemory);
                var d = a.byteSize + e.GEOMETRY_OVERHEAD;
                a.streamingDraw || (e.isMobileDevice() && (d += a.byteSize), this.gpuMeshMemory += a.byteSize, this.gpuNumMeshes += 1),
                    this.numGeomsInMemory++,
                (void 0 === c || c <= 0) && (c = this.geoms.length),
                    this.geoms[c] = a;
                var f = this.geomBoxes.length / 6 | 0;
                if (f < this.geoms.length) {
                    var g = 3 * this.geoms.length / 2 | 0,
                        h = new Float32Array(6 * g);
                    h.set(this.geomBoxes);
                    var i = new THREE.Box3;
                    for (i.makeEmpty(); f < g;) h[6 * f] = i.min.x,
                        h[6 * f + 1] = i.min.y,
                        h[6 * f + 2] = i.min.z,
                        h[6 * f + 3] = i.max.x,
                        h[6 * f + 4] = i.max.y,
                        h[6 * f+++5] = i.max.z;
                    this.geomBoxes = h
                }
                var j = a.boundingBox;
                this.geomBoxes[6 * c] = j.min.x,
                    this.geomBoxes[6 * c + 1] = j.min.y,
                    this.geomBoxes[6 * c + 2] = j.min.z,
                    this.geomBoxes[6 * c + 3] = j.max.x,
                    this.geomBoxes[6 * c + 4] = j.max.y,
                    this.geomBoxes[6 * c + 5] = j.max.z,
                e.memoryOptimizedLoading && !this.is2d && (a.boundingBox = null, a.boundingSphere = null),
                    this.geomMemory += d;
                var k = a.attributes.index.array || a.ib,
                    l = k.length / 3;
                return this.geomPolyCount += l,
                    this.instancePolyCount += l * (b || 1),
                    a.polyCount = l,
                    a.instanceCount = b || 1,
                    a.svfid = c,
                    a.lockCount = 0,
                    c
            },
            d.prototype.removeGeometry = function(a, b) {
                var c = this.getGeometry(a);
                if (!c || c.lockCount > 0) return 0;
                var d = c.byteSize + e.GEOMETRY_OVERHEAD;
                return b && b.deallocateGeometry(c),
                c.streamingDraw || (e.isMobileDevice() && (d += c.byteSize), this.gpuMeshMemory -= c.byteSize, this.gpuNumMeshes -= 1),
                    this.geoms[a] = null,
                    this.geomMemory -= d,
                    this.numGeomsInMemory--,
                    this.geomPolyCount -= c.polyCount,
                    this.instancePolyCount -= c.instanceCount * c.polyCount,
                    d
            },
            d.prototype.lockGeometry = function(a) {
                var b = this.getGeometry(a);
                return !! b && (++b.lockCount, !0)
            },
            d.prototype.unlockGeometry = function(a) {
                var b = this.getGeometry(a);
                return ! (!b || b.lockCount <= 0) && (--b.lockCount, !0)
            },
            d.prototype.getLockCount = function(a) {
                var b = this.getGeometry(a);
                return b ? b.lockCount: -1
            },
            d.prototype.getModelBox = function(a, b) {
                if (this.geomBoxes.length / 6 <= a) return void b.makeEmpty();
                var c = 6 * a,
                    d = this.geomBoxes;
                b.min.x = d[c],
                    b.min.y = d[c + 1],
                    b.min.z = d[c + 2],
                    b.max.x = d[c + 3],
                    b.max.y = d[c + 4],
                    b.max.z = d[c + 5]
            },
            d.prototype.dispose = function(a) {
                if (a) for (var b = 0,
                                c = this.geoms.length; b < c; b++) this.geoms[b] && a.deallocateGeometry(this.geoms[b])
            },
            d.prototype.printStats = function() {
                THREE.log("Total geometry size: " + this.geomMemory / 1048576 + " MB"),
                    THREE.log("Number of meshes: " + this.geoms.length),
                    THREE.log("Num Meshes on GPU: " + this.gpuNumMeshes),
                    THREE.log("Net GPU geom memory used: " + this.gpuMeshMemory)
            },
            a.exports = d
    },
    function(a, b, c) {
        "use strict";
        function d() {
            g || (g = new THREE.Box3)
        }
        function e(a, b, c, e) {
            this.frags = a,
                this.indices = b,
                this.start = c,
                this.count = e,
                this.lastItem = c,
                this.overrideMaterial = null,
                this.sortDone = !1,
                this.numAdded = 0,
                this.avgFrameTime = void 0,
                this.nodeIndex = void 0,
                this.boundingBox = new THREE.Box3,
                this.boundingBoxHidden = new THREE.Box3,
                this.sortObjects = !1,
                this.sortDone = !1,
                this.sortByShaderDone = !1,
                this.depths = null,
                this.indicesView = null,
                this.frustumCulled = !0,
                this.forceVisible = !1,
                this.renderImmediate = !a.useThreeMesh,
                this.renderImportance = 0,
                d()
        }
        function f(a, b, c, d) {
            var e = !1;
            return c.getWorldBounds(d, g),
            a && !b.intersectsBox(g) && (e = !0),
                e
        }
        var g, h = c(71),
            i = c(80),
            j = c(83);
        e.prototype.getIndices = function() {
            return Array.isArray(this.indices) ? this.indices[0] : this.indices
        },
            e.prototype.sortByMaterial = function() {
                if (! (this.numAdded < this.count)) {
                    var a = this.frags,
                        b = this.getIndices();
                    if (!b) return void THREE.warn("Only indexed RenderSubsets can be sorted.");
                    var c = b.subarray(this.start, this.start + this.count);
                    Array.prototype.sort.call(c,
                        function(b, c) {
                            var d = a.getMaterialId(b),
                                e = a.getMaterialId(c);
                            return void 0 === d ? e ? 1 : 0 : void 0 === e ? -1 : d - e
                        }),
                        this.numAdded = 0,
                        this.sortDone = !0
                }
            },
            e.prototype.sortByShader = function() {
                if (this.sortDone && !this.sortByShaderDone) {
                    var a = this.frags,
                        b = this.getIndices(),
                        c = b.subarray(this.start, this.start + this.count);
                    Array.prototype.sort.call(c,
                        function(b, c) {
                            var d = a.getMaterial(b),
                                e = a.getMaterial(c),
                                f = d.program.id - e.program.id;
                            return f || d.id - e.id
                        }),
                        this.numAdded = 0,
                        this.sortByShaderDone = !0
                }
            },
            e.prototype.sortByDepth = function() {
                function a(a, c) {
                    b.getGeometry(a) ? (b.getWorldBounds(a, e), f[c] = d.estimateDepth(e)) : f[c] = -1 / 0
                }
                var b, c, d, e, f;
                return function(h) {
                    if (b = this.frags, c = this.getIndices(), d = h, e = g, !c) return void THREE.warn("Only indexed RenderSubsets can be sorted."); (!this.indicesView || this.indicesView.length < this.count) && (this.indicesView = c.subarray(this.start, this.start + this.count)),
                    (!this.depths || this.depths.length < this.count) && (this.depths = new Float32Array(this.count)),
                        f = this.depths,
                        this.forEachNoMesh(a);
                    for (var i, j, k = 1; k < f.length; k++) for (var l = k; l > 0 && f[l - 1] < f[l];) i = f[l - 1],
                        f[l - 1] = f[l],
                        f[l] = i,
                        j = this.indicesView[l - 1],
                        this.indicesView[l - 1] = this.indicesView[l],
                        this.indicesView[l] = j,
                        l--
                }
            } (),
            e.prototype.onFragmentAdded = function() {
                return function(a) {
                    this.frags.getWorldBounds(a, g),
                        this.boundingBox.union(g),
                        this.sortDone = !1,
                    this.lastItem <= a && (this.lastItem = a + 1, void 0 !== this.visibleStats && (this.visibleStats = 0), this.numAdded++)
                }
            } (),
            e.prototype.forEach = function(a, b, c) {
                var d, e, f, g, d, f, e, g, i = this.getIndices(),
                    j = this.frags,
                    k = !this.sortByShaderDone;
                if (b || c || k) for (d = b == h.MESH_RENDERFLAG && this.hasOwnProperty("drawStart") ? this.drawStart: this.start, f = this.lastItem; d < f; d++) {
                    e = i ? i[d] : d;
                    var g = j.getVizmesh(e, this.renderImportance); ! k || g && g.material && g.material.program && !g.geometry_proxy || (k = !1),
                    !(c || g && g.geometry) || b && !j.isFlagSet(e, b) || a(g, e)
                } else for (d = this.start, f = this.lastItem; d < f; d++) {
                    e = i ? i[d] : d;
                    var g = j.getVizmesh(e, this.renderImportance);
                    g && g.geometry && a(g, e)
                }
                k && this.sortByShader()
            },
            e.prototype.forEachNoMesh = function(a, b, c) {
                for (var d = this.getIndices(), e = this.frags, f = this.start, g = this.lastItem; f < g; f++) {
                    var h, i = d ? d[f] : f;
                    if (e.useThreeMesh) {
                        var j = e.getVizmesh(i);
                        j && (h = j.geometry)
                    } else h = e.getGeometry(i); ! c && !h || b && !e.isFlagSet(i, b) || a(i, f - this.start)
                }
            },
            e.prototype.raycast = function() {
                return function(a, b, c) {
                    if (!1 !== a.ray.isIntersectionBox(this.boundingBox)) {
                        var d = this,
                            e = g;
                        this.forEach(function(f, g) {
                                if (!d.frags.isFlagSet(g, h.MESH_HIDE)) {
                                    if (c && c.length) {
                                        var j = 0 | d.frags.getDbIds(g);
                                        if ( - 1 === c.indexOf(j)) return
                                    }
                                    d.frags.getWorldBounds(g, e),
                                        e.expandByScalar(.5),
                                    a.ray.isIntersectionBox(e) && i.rayCast(f, a, b)
                                }
                            },
                            h.MESH_VISIBLE)
                    }
                }
            } (),
            e.prototype.calculateBounds = function() {
                function a(a) {
                    e.getWorldBounds(a, f),
                        1 & b[a] ? c.union(f) : d.union(f)
                }
                var b, c, d, e, f;
                return function() {
                    this.boundingBox.makeEmpty(),
                        this.boundingBoxHidden.makeEmpty(),
                        b = this.frags.vizflags,
                        c = this.boundingBox,
                        d = this.boundingBoxHidden,
                        e = this.frags,
                        f = g,
                        this.forEachNoMesh(a, 0, this.frags.onDemandLoadingEnabled())
                }
            } (),
            e.prototype.evalVisbility = function(a, b, c) {
                var d, e = b[c] & ~h.MESH_RENDERFLAG;
                switch (a) {
                    case h.RENDER_HIDDEN:
                        d = !(e & h.MESH_VISIBLE);
                        break;
                    case h.RENDER_HIGHLIGHTED:
                        d = e & h.MESH_HIGHLIGHTED;
                        break;
                    default:
                        d = 1 == (e & (h.MESH_VISIBLE | h.MESH_HIGHLIGHTED | h.MESH_HIDE))
                }
                return b[c] = e | (d ? h.MESH_RENDERFLAG: 0),
                    d
            },
            e.prototype.applyVisibility = function() {
                function a(a, b) {
                    if (!a && c.useThreeMesh || !a.geometry) return void(i && i(b));
                    if (f(k, e, c, b)) return a ? a.visible = !1 : THREE.warn("Unexpected null mesh"),
                        void(d[b] = d[b] & ~h.MESH_RENDERFLAG);
                    var j = this.evalVisbility(g, d, b);
                    a && (a.visible = !!j),
                        l = l && !j
                }
                function b(a) {
                    if (!c.getGeometryId(a)) return void(i && i(a));
                    if (f(k, e, c, a)) return void(d[a] = d[a] & ~h.MESH_RENDERFLAG);
                    var b = this.evalVisbility(g, d, a);
                    l = l && !b
                }
                var c, d, e, g, i, k, l;
                return function(f, m, n) {
                    l = !0,
                        e = m,
                        g = f,
                        i = n;
                    var o = e.intersectsBox(g === h.RENDER_HIDDEN ? this.boundingBoxHidden: this.boundingBox);
                    return o === j.OUTSIDE ? l: (d = this.frags.vizflags, c = this.frags, k = o !== j.CONTAINS, n || c.useThreeMesh ? this.forEach(a.bind(this), null, i) : this.forEachNoMesh(b.bind(this), null), l)
                }
            } (),
            a.exports = e
    },
    function(a, b) {
        "use strict";
        function c() {
            this.frustum = new THREE.Frustum,
                this.viewProj = new THREE.Matrix4,
                this.viewDir = [0, 0, 1],
                this.ar = 1,
                this.viewport = new THREE.Vector3(1, 1, 1),
                this.areaConv = 1,
                this.areaCullThreshold = 1,
                this.eye = new THREE.Vector3
        }
        var d = [[1, 5, 4, 7, 3, 2, 6], [0, 3, 2, 1, 5, 4, 6], [0, 3, 2, 6, 5, 4, 6], [0, 4, 7, 3, 2, 1, 6], [0, 3, 2, 1, -1, -1, 4], [0, 3, 2, 6, 5, 1, 6], [0, 4, 7, 6, 2, 1, 6], [0, 3, 7, 6, 2, 1, 6], [0, 3, 7, 6, 5, 1, 6], [0, 1, 5, 4, 7, 3, 6], [0, 1, 5, 4, -1, -1, 4], [0, 1, 2, 6, 5, 4, 6], [0, 4, 7, 3, -1, -1, 4], [ - 1, -1, -1, -1, -1, -1, 0], [1, 2, 6, 5, -1, -1, 4], [0, 4, 7, 6, 2, 3, 6], [2, 3, 7, 6, -1, -1, 4], [1, 2, 3, 7, 6, 5, 6], [0, 1, 5, 6, 7, 3, 6], [0, 1, 5, 6, 7, 4, 6], [0, 1, 2, 6, 7, 4, 6], [0, 4, 5, 6, 7, 3, 6], [4, 5, 6, 7, -1, -1, 4], [1, 2, 6, 7, 4, 5, 6], [0, 4, 5, 6, 2, 3, 6], [2, 3, 7, 4, 5, 6, 6], [1, 2, 3, 7, 4, 5, 6]];
        Object.defineProperty(c, "OUTSIDE", {
            value: 0
        }),
            Object.defineProperty(c, "INTERSECTS", {
                value: 1
            }),
            Object.defineProperty(c, "CONTAINS", {
                value: 2
            }),
            Object.defineProperty(c, "CONTAINMENT_UNKNOWN", {
                value: -1
            }),
            c.prototype.reset = function(a) {
                this.viewProj.multiplyMatrices(a.projectionMatrix, a.matrixWorldInverse),
                    this.frustum.setFromMatrix(this.viewProj);
                var b = a.matrixWorldInverse.elements;
                this.ar = a.aspect,
                    this.viewDir[0] = -b[2],
                    this.viewDir[1] = -b[6],
                    this.viewDir[2] = -b[10],
                    this.eye.x = a.position.x,
                    this.eye.y = a.position.y,
                    this.eye.z = a.position.z,
                    this.areaConv = a.clientWidth * a.clientHeight / 4
            },
            c.prototype.projectedArea = function() {
                function a() {
                    c || (c = [new THREE.Vector3, new THREE.Vector3, new THREE.Vector3, new THREE.Vector3, new THREE.Vector3, new THREE.Vector3, new THREE.Vector3, new THREE.Vector3], d = new THREE.Box2)
                }
                function b(a, b) {
                    var c = a.x,
                        d = a.y,
                        e = a.z,
                        f = b.elements,
                        g = f[3] * c + f[7] * d + f[11] * e + f[15];
                    g < 0 && (g = -g);
                    var h = 1 / g;
                    a.x = (f[0] * c + f[4] * d + f[8] * e + f[12]) * h,
                        a.y = (f[1] * c + f[5] * d + f[9] * e + f[13]) * h
                }
                var c, d;
                return function(e) {
                    if (e.empty()) return 0;
                    a();
                    var f = this.viewProj;
                    c[0].set(e.min.x, e.min.y, e.min.z),
                        c[1].set(e.min.x, e.min.y, e.max.z),
                        c[2].set(e.min.x, e.max.y, e.min.z),
                        c[3].set(e.min.x, e.max.y, e.max.z),
                        c[4].set(e.max.x, e.min.y, e.min.z),
                        c[5].set(e.max.x, e.min.y, e.max.z),
                        c[6].set(e.max.x, e.max.y, e.min.z),
                        c[7].set(e.max.x, e.max.y, e.max.z);
                    for (var g = 0; g < 8; g++) b(c[g], f);
                    return d.makeEmpty(),
                        d.setFromPoints(c),
                    d.min.x < -1 && (d.min.x = -1),
                    d.min.x > 1 && (d.min.x = 1),
                    d.min.y < -1 && (d.min.y = -1),
                    d.min.y > 1 && (d.min.y = 1),
                    d.max.x > 1 && (d.max.x = 1),
                    d.max.x < -1 && (d.max.x = -1),
                    d.max.y > 1 && (d.max.y = 1),
                    d.max.y < -1 && (d.max.y = -1),
                    (d.max.x - d.min.x) * (d.max.y - d.min.y)
                }
            } (),
            c.prototype.projectedBoxArea = function() {
                function a() {
                    if (!e) {
                        e = [],
                            f = [];
                        for (var a = 0; a < 10; a++) e.push(new THREE.Vector3),
                            f.push(new THREE.Vector3)
                    }
                }
                function b(a, b) {
                    var c = a.x,
                        d = a.y,
                        e = a.z,
                        f = b.elements,
                        g = f[3] * c + f[7] * d + f[11] * e + f[15];
                    g < 0 && (g = -g);
                    var h = 1 / g;
                    a.x = (f[0] * c + f[4] * d + f[8] * e + f[12]) * h,
                        a.y = (f[1] * c + f[5] * d + f[9] * e + f[13]) * h
                }
                function c(a, b) {
                    var c, d, e, h, i, j, k, l, m = a,
                        n = f,
                        o = function(a) {
                            switch (k) {
                                case 0:
                                    return a.x >= -1;
                                case 1:
                                    return a.x <= 1;
                                case 2:
                                    return a.y >= -1;
                                case 3:
                                    return a.y <= 1
                            }
                        },
                        p = function(a) {
                            n[l].x = a.x,
                                n[l++].y = a.y
                        },
                        q = function() {
                            var a, b;
                            switch (k) {
                                case 0:
                                    a = -1,
                                        b = d.y + (e.y - d.y) * (a - d.x) / (e.x - d.x);
                                    break;
                                case 1:
                                    a = 1,
                                        b = d.y + (e.y - d.y) * (a - d.x) / (e.x - d.x);
                                    break;
                                case 2:
                                    b = -1,
                                        a = d.x + (e.x - d.x) * (b - d.y) / (e.y - d.y);
                                    break;
                                case 3:
                                    b = 1,
                                        a = d.x + (e.x - d.x) * (b - d.y) / (e.y - d.y)
                            }
                            n[l].x = a,
                                n[l++].y = b
                        };
                    for (k = 0; k < 4 && b > 2; k++) {
                        for (l = 0, d = m[b - 1], h = o(d), j = 0; j < b; j++) e = m[j],
                            i = o(e),
                            h ? i ? p(e) : q() : i && (q(), p(e)),
                            d = e,
                            h = i;
                        b = l,
                            c = m,
                            m = n,
                            n = c
                    }
                    return g = b,
                        m
                }
                var e, f, g;
                return function(f, h) {
                    if (f.empty()) return 0;
                    a();
                    var i, j = this.viewProj;
                    if (i = this.eye.x >= f.min.x ? this.eye.x > f.max.x ? 2 : 1 : 0, this.eye.y >= f.min.y && (i += this.eye.y > f.max.y ? 6 : 3), this.eye.z >= f.min.z && (i += this.eye.z > f.max.z ? 18 : 9), 13 === i) return 4;
                    var k, l = d[i][6];
                    for (k = 0; k < l; k++) {
                        var m = d[i][k];
                        e[k].set((m + 1) % 4 < 2 ? f.min.x: f.max.x, m % 4 < 2 ? f.min.y: f.max.y, m < 4 ? f.min.z: f.max.z),
                            b(e[k], j)
                    }
                    var n = 0;
                    if (h) for (n = (e[l - 1].x - e[0].x) * (e[l - 1].y + e[0].y), k = 0; k < l - 1; k++) n += (e[k].x - e[k + 1].x) * (e[k].y + e[k + 1].y);
                    else {
                        var o = c(e, l);
                        if (g >= 3) for (n = (o[g - 1].x - o[0].x) * (o[g - 1].y + o[0].y), k = 0; k < g - 1; k++) n += (o[k].x - o[k + 1].x) * (o[k].y + o[k + 1].y)
                    }
                    return Math.abs(.5 * n)
                }
            } (),
            c.prototype.estimateDepth = function(a) {
                var b = this.viewProj.elements,
                    c = (a.min.x + a.max.x) / 2,
                    d = (a.min.y + a.max.y) / 2,
                    e = (a.min.z + a.max.z) / 2,
                    f = 1 / (b[3] * c + b[7] * d + b[11] * e + b[15]);
                return (b[2] * c + b[6] * d + b[10] * e + b[14]) * f
            },
            c.prototype.intersectsBox = function() {
                function a() {
                    b || (b = new THREE.Vector3, d = new THREE.Vector3)
                }
                var b, d;
                return function(e) {
                    a();
                    for (var f = this.frustum.planes,
                             g = 0,
                             h = 0; h < 6; h++) {
                        var i = f[h];
                        b.x = i.normal.x > 0 ? e.min.x: e.max.x,
                            d.x = i.normal.x > 0 ? e.max.x: e.min.x,
                            b.y = i.normal.y > 0 ? e.min.y: e.max.y,
                            d.y = i.normal.y > 0 ? e.max.y: e.min.y,
                            b.z = i.normal.z > 0 ? e.min.z: e.max.z,
                            d.z = i.normal.z > 0 ? e.max.z: e.min.z;
                        var j = i.distanceToPoint(b),
                            k = i.distanceToPoint(d);
                        if (j < 0 && k < 0) return c.OUTSIDE;
                        j > 0 && k > 0 && g++
                    }
                    return 6 == g ? c.CONTAINS: c.INTERSECTS
                }
            } (),
            a.exports = {
                FrustumIntersector: c,
                OUTSIDE: c.OUTSIDE,
                INTERSECTS: c.INTERSECTS,
                CONTAINS: c.CONTAINS,
                CONTAINMENT_UNKNOWN: c.CONTAINMENT_UNKNOWN
            }
    },
    function(a, b, c) {
        "use strict";
        function d(a, b) {
            function c(a, b, c, d) {
                l.compose(b, c, d);
                for (var e = a.elements,
                         f = l.elements,
                         g = 0; g < 16; g++) {
                    var h = e[g],
                        i = f[g];
                    if (Math.abs(i - h) > 1e-5) return ! 1
                }
                return ! 0
            }
            var d = h();
            d.ib = a.ib,
                d.vb = a.vb,
                d.iblines = a.iblines,
                e(a, d),
                f(a, d);
            this.offsets = new Float32Array(3 * b),
                this.rotations = new Float32Array(4 * b),
                this.scalings = new Float32Array(3 * b),
                this.ids = new Uint8Array(3 * b);
            var i = new THREE.Vector3,
                j = new THREE.Quaternion,
                k = new THREE.Vector3,
                l = new THREE.Matrix4,
                m = 0,
                n = b;
            this.addInstance = function(a, b) {
                return m >= n ? (THREE.warn("Instance buffer is already full."), !1) : (a.decompose(i, j, k), !!c(a, i, j, k) && (this.offsets[3 * m] = i.x, this.offsets[3 * m + 1] = i.y, this.offsets[3 * m + 2] = i.z, this.rotations[4 * m] = j.x, this.rotations[4 * m + 1] = j.y, this.rotations[4 * m + 2] = j.z, this.rotations[4 * m + 3] = j.w, this.scalings[3 * m] = k.x, this.scalings[3 * m + 1] = k.y, this.scalings[3 * m + 2] = k.z, g(b, this.ids, 3 * m), m++, !0))
            },
                this.finish = function() {
                    if (0 == m) return null;
                    m < n && (this.offsets = new Float32Array(this.offsets.buffer, 0, 3 * m), this.rotations = new Float32Array(this.rotations.buffer, 0, 4 * m), this.scalings = new Float32Array(this.scalings.buffer, 0, 3 * m), this.ids = new Uint8Array(this.ids.buffer, 0, 3 * m));
                    var a = new THREE.BufferAttribute(this.offsets, 3),
                        b = new THREE.BufferAttribute(this.rotations, 4),
                        c = new THREE.BufferAttribute(this.scalings, 3),
                        e = new THREE.BufferAttribute(this.ids, 3);
                    return e.normalize = !0,
                        e.bytesPerItem = 1,
                        a.divisor = 1,
                        b.divisor = 1,
                        c.divisor = 1,
                        e.divisor = 1,
                        d.addAttribute("instOffset", a),
                        d.addAttribute("instRotation", b),
                        d.addAttribute("instScaling", c),
                        d.addAttribute("id", e),
                        d.numInstances = m,
                        d.byteSize = d.vb.byteLength + d.ib.byteLength + this.offsets.byteLength + this.rotations.byteLength + this.scalings.byteLength,
                        d
                }
        }
        var e = c(85).copyVertexFormat,
            f = c(85).copyPrimitiveProps,
            g = c(88).writeIdToBuffer,
            h = c(86).createBufferGeometry;
        a.exports = d
    },
    function(a, b, c) {
        "use strict";
        function d(a) {
            return a.isLines ? w.LINES: a.isPoints ? w.POINTS: a.isWideLines ? w.WIDE_LINES: w.TRIANGLES
        }
        function e(a, b) {
            switch (!0 === a.isLines && (a.isLines = void 0), !0 === a.isWideLines && (a.isWideLines = void 0), !0 === a.isPoints && (a.isPoints = void 0), b) {
                case w.LINES:
                    a.isLines = !0;
                    break;
                case w.WIDE_LINES:
                    a.isWideLines = !0;
                    break;
                case w.POINTS:
                    a.isPoints = !0
            }
        }
        function f(a) {
            this.geoms = [],
                this.matrices = [],
                this.vertexCount = 0,
                this.material = a,
                this.fragIds = [],
                this.worldBox = new THREE.Box3
        }
        function g(a, b) {
            a.vb && a.vbstride || THREE.warn("copyVertexFormat() supports only interleaved buffers");
            for (var c in a.attributes) b.attributes[c] = a.attributes[c];
            b.attributesKeys = a.attributesKeys.slice(0),
                b.vbstride = a.vbstride
        }
        function h(a, b) {
            e(b, d(a)),
                b.lineWidth = a.lineWidth,
                b.pointSize = a.pointSize
        }
        function i(a) {
            for (var b = a[0].vbstride, c = 0, f = 0, i = 0, j = 0; j < a.length; j++) {
                var k = a[j];
                c += a[j].ib.length,
                    f += r(k),
                a[j].iblines && (i += a[j].iblines.length)
            }
            var l = s();
            l.vb = new Float32Array(f * b),
                l.ib = new Uint16Array(c),
            i && (l.iblines = new Uint16Array(i)),
                l.byteSize = l.vb.byteLength + l.ib.byteLength,
            l.iblines && (l.byteSize += l.iblines.byteLength),
                h(a[0], l),
                g(a[0], l);
            var m = new THREE.BufferAttribute(null, 3);
            m.normalize = !0,
                m.bytesPerItem = 1,
                l.addAttribute("id", m);
            var n = a[0];
            return e(l, d(n)),
            n.isPoints && (l = n.pointSize),
            n.isWideLines && (l = n.lineWidth),
                l
        }
        function j(a, b) {
            for (var c = 0,
                     d = 0,
                     e = 0,
                     f = 0,
                     g = 0; g < a.length; g++) {
                for (var h = a[g], i = r(h), j = 0; j < h.ib.length; j++) b.ib[e + j] = h.ib[j] + d;
                if (h.iblines) {
                    for (var j = 0; j < h.iblines.length; j++) b.iblines[f + j] = h.iblines[j] + d;
                    f += h.iblines.length
                }
                b.vb.set(h.vb, c),
                    c += h.vb.length,
                    d += i,
                    e += h.ib.length
            }
        }
        function k(a, b, c, d, e) {
            var f = i(a);
            return f.boundingBox = d.clone(),
                j(a, f),
                e ? e.addMergeTask(a, f, b, c) : t(a, f, b, c),
                f
        }
        function l(a, b) {
            if (a.vbstride != b.vbstride) return ! 1;
            if (d(a) !== d(b)) return ! 1;
            if (a.isPoints && a.pointSize !== b.pointSize) return ! 1;
            if (a.isWideLines && a.lineWidth !== b.lineWidth) return ! 1;
            if (a.attributesKeys.length != b.attributesKeys.length) return ! 1;
            for (var c = 0,
                     e = a.attributesKeys.length; c < e; c++) {
                var f = a.attributesKeys[c],
                    g = a.attributes[f],
                    h = b.attributes[f];
                if (!h) return ! 1;
                if (g === h) return ! 0;
                if (g.itemOffset !== h.itemOffset || g.normalize !== h.normalize || g.itemSize !== h.itemSize || g.bytesPerItem !== h.bytesPerItem || g.isPattern !== h.isPattern) return ! 1
            }
            return ! 0
        }
        function m(a) {
            this.meshes = [],
                this.fragId2MeshIndex = new Int32Array(a);
            for (var b = 0; b < this.fragId2MeshIndex.length; b++) this.fragId2MeshIndex[b] = -1;
            this.byteSize = 0,
                this.consolidationMap = null
        }
        function n() {
            this.buckets = {},
                this.bucketCount = 0,
                this.costs = 0
        }
        function o(a, b) {
            this.fragOrder = new Uint32Array(a),
                this.ranges = new Uint32Array(b),
                this.boxes = new Array(b),
                this.numConsolidated = -1
        }
        function p(a) {
            u.createWorker = a
        }
        function q() {
            return !! u.createWorker
        }
        var r = c(78).getVertexCount,
            s = c(86).createBufferGeometry,
            t = c(87).runMergeSingleThreaded,
            u = c(87).ParallelGeomMerge,
            v = c(89).MATERIAL_VARIANT,
            w = {
                UNKNOWN: 0,
                TRIANGLES: 1,
                LINES: 2,
                WIDE_LINES: 3,
                POINTS: 4
            };
        f.prototype = {
            constructor: f,
            addGeom: function(a, b, c) {
                this.geoms.push(a),
                    this.fragIds.push(c),
                    this.worldBox.union(b),
                    this.vertexCount += r(a);
                var d = this.geoms.length;
                return 1 == d ? 0 : (void 0 === a.byteSize && THREE.warn("Error in consolidation: Geometry must contain byteSize."), a.byteSize + (2 == d ? this.geoms[0].byteSize: 0))
            }
        },
            m.prototype = {
                constructor: m,
                addContainerMesh: function(a, b, c, d, e) {
                    var f = new THREE.Mesh(a, b);
                    this.meshes.push(f),
                        this.byteSize += a.byteSize;
                    var g = d || 0,
                        h = e || c.length,
                        i = g + h;
                    f.frustumCulled = !1;
                    for (var j = this.meshes.length - 1,
                             k = g; k < i; k++) {
                        var l = c[k];
                        this.fragId2MeshIndex[l] = j
                    }
                },
                addSingleMesh: function(a, b, c, d, e) {
                    var f = new THREE.Mesh(a, b);
                    f.matrix.copy(d),
                        f.matrixAutoUpdate = !1,
                        f.dbId = e,
                        f.fragId = c,
                        this.meshes.push(f),
                        f.frustumCulled = !1,
                        this.fragId2MeshIndex[c] = this.meshes.length - 1
                },
                addSingleFragment: function(a, b) {
                    var c = a.getVizmesh(b);
                    this.addSingleMesh(c.geometry, c.material, b, c.matrixWorld, c.dbId)
                }
            },
            n.prototype = {
                addGeom: function(a, b, c, d) {
                    var e = null,
                        g = this.buckets[b.id];
                    if (g) for (var h = 0; h < g.length; h++) {
                        var i = g[h],
                            j = i.geoms[0];
                        if (l(j, a)) {
                            var k = r(a);
                            if (! (k + i.vertexCount > 65535)) {
                                e = i;
                                break
                            }
                        }
                    }
                    e || (e = new f(b), this.bucketCount++, this.buckets[b.id] ? this.buckets[b.id].push(e) : this.buckets[b.id] = [e]),
                        this.costs += e.addGeom(a, c, d)
                },
                createConsolidationMap: function(a, b) {
                    var c = a.length,
                        d = new o(c, this.bucketCount),
                        e = 0,
                        f = 0;
                    for (var g in this.buckets) for (var h = this.buckets[g], i = 0; i < h.length; i++) {
                        var j = h[i];
                        d.ranges[f] = e,
                            d.boxes[f] = j.worldBox,
                            d.fragOrder.set(j.fragIds, e),
                            e += j.fragIds.length,
                            f++
                    }
                    d.numConsolidated = b;
                    for (var k = b; k < a.length; k++) d.fragOrder[k] = a[k];
                    return d
                }
            },
            o.prototype = {
                buildConsolidation: function(a, b, c) {
                    var d = this.fragOrder,
                        e = a.getCount(),
                        f = this.ranges.length,
                        g = new m(e),
                        h = null;
                    q() && (h = new u(g));
                    for (var i = [], j = new THREE.Matrix4, l = 0; l < f; l++) {
                        var n = this.ranges[l],
                            o = l === f - 1 ? this.numConsolidated: this.ranges[l + 1],
                            p = o - n;
                        if (1 === p) {
                            var r = d[n];
                            g.addSingleFragment(a, r, g)
                        }
                        i.length = p;
                        for (var s = new Float32Array(16 * p), t = new Uint32Array(p), w = 0; w < p; w++) r = d[n + w],
                            i[w] = a.getGeometry(r),
                            a.getOriginalWorldMatrix(r, j),
                            s.set(j.elements, 16 * w),
                            t[w] = a.getDbIds(r);
                        var x = this.boxes[l],
                            y = d[n],
                            z = a.getMaterial(y),
                            A = k(i, s, t, x, h),
                            B = b.getMaterialVariant(z, v.VERTEX_IDS, c);
                        g.addContainerMesh(A, B, d, n, p)
                    }
                    return h && h.runTasks(),
                        g.consolidationMap = this,
                        g
                }
            },
            a.exports = {
                Consolidation: m,
                ConsolidationBuilder: n,
                copyVertexFormat: g,
                copyPrimitiveProps: h,
                mergeGeometries: k,
                registerWorkerSupport: p,
                multithreadingSupported: q
            }
    },
    function(a, b, c) {
        "use strict";
        function d(a, b, c) {
            var d;
            if (b.array) d = new THREE.BufferAttribute(b.array, b.itemSize);
            else {
                var e = a + "|" + b.bytesPerItem + "|" + b.normalize + "|" + b.isPattern + "|" + b.divisor + "|" + b.offset;
                if (d = l[e]) return d;
                d = new THREE.BufferAttribute(void 0, b.itemSize),
                    l[e] = d
            }
            return d.bytesPerItem = b.bytesPerItem,
                d.normalize = b.normalize,
                d.isPattern = b.isPattern,
            c && (d.divisor = b.divisor),
            b.array || (b.hasOwnProperty("offset") ? d.itemOffset = b.offset: THREE.warn("VB attribute is neither interleaved nor separate. Something is wrong with the buffer specificaiton.")),
                d
        }
        function e(a) {
            var b = "";
            for (var c in a.attributes) b += c + "|";
            var d = m[b];
            return d || (d = Object.keys(a.attributes), m[b] = d, d)
        }
        function f() {
            i = new THREE.BufferAttribute(void 0, 1),
                j = function() {
                    this.uuid = null,
                        this.name = null,
                        this.id = n++,
                        this.attributes = {},
                        this.attributesKeys = [],
                        this.drawcalls = [],
                        this.offsets = this.drawcalls,
                        this.boundingBox = null,
                        this.boundingSphere = null,
                        this.numInstances = void 0,
                        this.streamingDraw = !1,
                        this.streamingIndex = !1,
                        this.svfid = void 0,
                        this.vb = null,
                        this.vbbuffer = void 0,
                        this.ib = null,
                        this.ibbuffer = void 0,
                        this.iblines = null,
                        this.iblinesbuffer = void 0,
                        this.vaos = void 0,
                        this.vbNeedsUpdate = !1,
                        this.vbstride = 0,
                        this.byteSize = 0,
                        this.attributesKeys = void 0,
                        this.__webglInit = void 0
                },
                j.prototype = Object.create(THREE.BufferGeometry.prototype),
                j.prototype.constructor = j
        }
        function g() {
            return j || f(),
                new j
        }
        function h(a) {
            var b = a.mesh,
                c = g();
            k.isNodeJS() && (c.packId = a.packId, c.meshIndex = a.meshIndex),
                c.byteSize = 0,
                c.vb = b.vb,
                c.vbbuffer = void 0,
                c.vbNeedsUpdate = !0,
                c.byteSize += b.vb.byteLength,
                c.vbstride = b.vbstride,
            b.isLines && (c.isLines = b.isLines),
            b.isWideLines && (c.isWideLines = !0, c.lineWidth = b.lineWidth),
            b.isPoints && (c.isPoints = b.isPoints, c.pointSize = b.pointSize),
            a.is2d && (c.is2d = !0),
                c.numInstances = b.numInstances;
            for (var f in b.vblayout) {
                var h = b.vblayout[f];
                c.attributes[f] = d(f, h, c.numInstances)
            }
            k.memoryOptimizedLoading ? (c.attributes.index = i, c.ib = b.indices, c.ibbuffer = void 0, c.iblines = b.iblines, c.ibbuffer = void 0) : c.addAttribute("index", new THREE.BufferAttribute(b.indices, 1)),
                c.attributesKeys = e(c),
                c.byteSize += b.indices.byteLength,
            b.vb.length / b.vbstride > 65535 && THREE.warn("Mesh with >65535 vertices. It will fail to draw."),
                c.boundingBox = (new THREE.Box3).copy(b.boundingBox),
                c.boundingSphere = (new THREE.Sphere).copy(b.boundingSphere),
                c.drawcalls = null,
                c.offsets = null,
                a.geometry = c,
                a.mesh = null
        }
        var i, j, k = c(71),
            l = {},
            m = {},
            n = 1;
        a.exports = {
            meshToGeometry: h,
            createBufferGeometry: g
        }
    },
    function(a, b, c) {
        "use strict";
        function d(a) {
            for (var b = new Uint16Array(a.length + 1), c = 0, d = 0; d < a.length; d++) b[d] = c,
                c += j(a[d]);
            return b[d] = c,
                b
        }
        function e(a, b, c, e) {
            var f = d(a),
                g = new i;
            return g.vb = b.vb,
                g.vbstride = b.vbstride,
                g.posOffset = b.attributes.position.itemOffset,
                g.normalOffset = b.attributes.normal ? b.attributes.normal.itemOffset: -1,
                g.matrices = c,
                g.ranges = f,
                g.dbIds = e,
                g
        }
        function f(a, b) {
            b.vb = a.vb,
                b.attributes.id.array = a.vertexIds,
                b.needsUpdate = !0
        }
        function g(a) {
            function b(a) {
                for (var b = a.data,
                         e = 0; e < b.length; e++) {
                    var g = b[e],
                        h = g.taskId;
                    f(g, d[h]),
                        delete d[h]
                }
                if (0 === --c) for (i.inProgress = !1, e = 0; e < j.length; e++) j[e].clearAllEventListenerWithIntercept(),
                    j[e].terminate(),
                    j[e] = null
            }
            var c = 0,
                d = {},
                h = [],
                i = a,
                j = new Array(2);
            this.addMergeTask = function(a, b, c, f) {
                var g = e(a, b, c, f);
                h.push(g),
                    d[g.id] = b
            },
                this.runTasks = function() {
                    for (var a = 0; a < 2; a++) j[a] = g.createWorker(),
                        j[a].addEventListenerWithIntercept(b);
                    for (var d = h.length,
                             e = Math.floor(d / 2), f = 0; f < 2; f++) {
                        var k = 1 === f,
                            l = f * e,
                            m = k ? d: l + e,
                            n = m - l,
                            o = [],
                            p = new Array(4 * n),
                            q = 0;
                        for (a = l; a < m; a++) {
                            var r = h[a];
                            p[q++] = r.vb.buffer,
                                p[q++] = r.matrices.buffer,
                                p[q++] = r.ranges.buffer,
                                p[q++] = r.dbIds.buffer,
                                o.push(r)
                        }
                        var s = {
                            operation: "MERGE_GEOMETRY",
                            tasks: o
                        };
                        j[f].doOperation(s, p),
                            c++
                    }
                    i.inProgress = !0
                }
        }
        function h(a, b, c, d) {
            var g = e(a, b, c, d),
                h = new THREE.Vector3,
                i = new THREE.Matrix4;
            f(g.run(i, h), b)
        }
        var i = c(88).GeomMergeTask,
            j = c(78).getVertexCount;
        a.exports = {
            ParallelGeomMerge: g,
            runMergeSingleThreaded: h
        }
    },
    function(a, b) {
        "use strict";
        function c() {
            return j++
        }
        function d() {
            this.vb = null,
                this.vbstride = 0,
                this.posOffset = 0,
                this.normalOffset = 0,
                this.matrices = null,
                this.ranges = null,
                this.dbIds = null,
                this.id = c()
        }
        function e(a) {
            a.x = .5 * (1 + Math.atan2(a.y, a.x) / Math.PI),
                a.y = .5 * (1 + a.z),
                a.z = 0
        }
        function f(a) {
            var b = 2 * a.x - 1,
                c = 2 * a.y - 1,
                d = Math.sin(b * Math.PI),
                e = Math.cos(b * Math.PI),
                f = Math.sqrt(1 - c * c),
                g = c;
            a.x = e * f,
                a.y = d * f,
                a.z = g
        }
        function g(a, b, c) {
            b[c++] = 255 & a,
                b[c++] = a >> 8 & 255,
                b[c++] = a >> 16 & 255,
                b[c] = 0
        }
        function h(a, b) {
            return b.copy(a),
                b[12] = 0,
                b[13] = 0,
                b[14] = 0,
                b.getInverse(b).transpose()
        }
        function i(a, b, c) {
            for (var d = 16 * a,
                     e = 0; e < 16; e++) c.elements[e] = b[e + d]
        }
        var j = 1,
            k = function(a, b, c, d, g, i, j) {
                for (var k = a.posOffset,
                         l = d; l < g; l++) {
                    var m = l * a.vbstride + k;
                    j.set(a.vb[m], a.vb[m + 1], a.vb[m + 2]),
                        j.applyMatrix4(c),
                        a.vb[m] = j.x,
                        a.vb[m + 1] = j.y,
                        a.vb[m + 2] = j.z
                }
                if ( - 1 !== a.normalOffset) {
                    var n = 2 * a.vbstride,
                        o = 2 * a.normalOffset,
                        p = h(c, i);
                    for (l = d; l < g; l++) {
                        var q = l * n + o;
                        j.set(b[q], b[q + 1], 0),
                            j.divideScalar(65535),
                            f(j),
                            j.applyMatrix4(p),
                            j.normalize(),
                            e(j),
                            j.multiplyScalar(65535),
                            b[q] = j.x,
                            b[q + 1] = j.y
                    }
                }
            };
        d.prototype.run = function(a, b) {
            for (var c = this.vb,
                     d = c.length / this.vbstride,
                     e = a.clone(), f = new Uint8Array(3 * d), h = -1 !== this.normalOffset, j = h ? new Uint16Array(c.buffer, c.byteOffset, 2 * c.length) : null, l = this.ranges, m = this.matrices, n = l.length - 1, o = 0; o < n; o++) {
                var p = l[o],
                    q = l[o + 1];
                i(o, m, a),
                    k(this, j, a, p, q, e, b);
                for (var r = 3 * p,
                         s = q - p,
                         t = this.dbIds[o], u = 0; u < s; u++) g(t, f, r),
                    r += 3
            }
            return {
                taskId: this.id,
                vb: this.vb,
                vertexIds: f
            }
        },
            a.exports = {
                GeomMergeTask: d,
                writeIdToBuffer: g
            }
    },
    function(a, b, c) {
        "use strict";
        var d = c(90).CreateLinePatternTexture,
            e = c(91).clonePrismMaterial,
            f = function(a) {
                this._renderer = a,
                    this._textures = {},
                    this._texturesToUpdate = [],
                    this._materials = {},
                    this._materialsNonHDR = {},
                    this._exposureBias = 0,
                    this._tonemapMethod = 0,
                    this._envMapExposure = 1,
                    this._envRotationSin = 0,
                    this._envRotationCos = 1,
                    this._reflectionMap = null,
                    this._irradianceMap = null,
                    this._cutplanes = [],
                    this._mrtNormals = !1,
                    this._mrtIdBuffer = void 0,
                    this._pixelsPerUnit = 1,
                    this._layerMaskTex = null,
                    this._layersMap = null,
                    this._lineStyleTex = null,
                    this._selectionTex = null,
                    this._swapBlackAndWhite = 0
            };
        f.MATERIAL_VARIANT = {
            INSTANCED: 0,
            VERTEX_IDS: 1
        },
            f.prototype._getModelHash = function(a) {
                return "model:" + (a ? a.id: "") + "|"
            },
            f.prototype._getMaterialHash = function(a, b) {
                return this._getModelHash(a) + "mat:" + b
            },
            f.prototype._getTextureHash = function(a, b, c) {
                return this._getModelHash(a) + "tex:" + b + "|map:" + c
            },
            f.prototype.addNonHDRMaterial = function(a, b) {
                b.doNotCut || (b.cutplanes = this._cutplanes),
                    this._materialsNonHDR[a] = b
            },
            f.prototype.addHDRMaterial = function(a, b) {
                this._reflectionMap && !b.disableEnvMap && (b.envMap = this._reflectionMap),
                this._irradianceMap && (b.irradianceMap = this._irradianceMap),
                    b.exposureBias = Math.pow(2, this._exposureBias),
                    b.tonemapOutput = this._tonemapMethod,
                    b.envMapExposure = this._envMapExposure,
                    b.envRotationSin = this._envRotationSin,
                    b.envRotationCos = this._envRotationCos,
                b.doNotCut || (b.cutplanes = this._cutplanes),
                    this._applyMRTFlags(b),
                    this._applyPolygonOffset(b, this._polygonOffsetOn),
                    this._materials[a] = b
            },
            f.prototype.addLineMaterial = function(a, b) {
                this._layerMaskTex && (b.defines.HAS_LAYERS = 1, b.uniforms.tLayerMask.value = this._layerMaskTex),
                this._lineStyleTex && (b.defines.HAS_LINESTYLES = 1, b.defines.MAX_LINESTYLE_LENGTH = this._lineStyleTex.image.width, b.uniforms.tLineStyle.value = this._lineStyleTex, b.uniforms.vLineStyleTexSize.value.set(this._lineStyleTex.image.width, this._lineStyleTex.image.height)),
                    b.uniforms.aaRange.value = .5 / (this._pixelsPerUnit * b.modelScale),
                    b.uniforms.pixelsPerUnit.value = this._pixelsPerUnit * b.modelScale,
                    b.uniforms.swap.value = this._swapBlackAndWhite,
                    this._materials[a] = b
            },
            f.prototype.addOverrideMaterial = function(a, b) {
                if (this.addNonHDRMaterial(a, b), b.variants) for (var c = 0; c < b.variants.length; c++) {
                    var d = b.variants[c];
                    if (d) {
                        var e = a + "_variant_" + c;
                        this.addNonHDRMaterial(e, d)
                    }
                }
            },
            f.prototype.getMaterialVariant = function(a, b, c) {
                var d = this._getModelHash(c) + a.id + "|" + b,
                    e = this._materials[d];
                return e || (e = this.cloneMaterial(a, c), b === f.MATERIAL_VARIANT.INSTANCED ? (e.useInstancing = !0, e.vertexIds = !0) : b === f.MATERIAL_VARIANT.VERTEX_IDS && (e.vertexIds = !0), this.addHDRMaterial(d, e)),
                    e
            },
            f.prototype.removeMaterial = function(a) {
                delete this._materials[a]
            },
            f.prototype.findMaterial = function(a) {
                return this._materials[a]
            },
            f.prototype.forEach = function(a) {
                var b = this._materials;
                for (var c in b) a(b[c])
            },
            f.prototype.updateMaterials = function() {
                for (var a = {
                    needsClear: !1,
                    needsRender: !1,
                    overlayDirty: !1
                }; this._texturesToUpdate.length;) for (var b = this._texturesToUpdate.pop(), c = 0; c < b.mats.length; c++) b.mats[c][b.slots[c]] = b.tex,
                    b.mats[c].needsUpdate = !0,
                    a.needsClear = !0;
                return a
            },
            f.prototype.setTextureInCache = function(a, b, c) {
                var d = this._getTextureHash(a, b.uri, b.mapName),
                    e = this._textures[d];
                if (e) {
                    e.tex || (e.tex = c);
                    for (var f = 0; f < e.mats.length; f++) e.mats[f][e.slots[f]] = c;
                    this._texturesToUpdate.push(e)
                }
            },
            f.prototype.loadTextureFromCache = function(a, b, c, d) {
                var e = this._getTextureHash(a, c.uri, c.mapName),
                    f = this._textures[e];
                return f ? f.tex ? (b[d] = f.tex, b.needsUpdate = !0) : (f.mats.push(b), f.slots.push(d)) : this._textures[e] = {
                    mats: [b],
                    slots: [d],
                    tex: null
                },
                    !!f
            },
            f.prototype.exportModelMaterials = function(a, b) {
                var c = this._getModelHash(a),
                    d = {};
                for (var e in this._materials) if ( - 1 !== e.indexOf(c)) {
                    var f = this._materials[e],
                        g = f.defines && f.defines.hasOwnProperty("SELECTION_RENDERER");
                    g || (d[e] = f)
                }
                var h = {};
                for (var e in this._materialsNonHDR) - 1 !== e.indexOf(c) && (h[e] = this._materialsNonHDR[e]);
                var i = {};
                for (var j in this._textures) - 1 !== j.indexOf(c) && (i[j] = this._textures[j]);
                return this.cleanup(a),
                {
                    mats: d,
                    matsNonHDR: h,
                    textures: i
                }
            },
            f.prototype.importModelMaterials = function(a) {
                for (var b in a.mats) {
                    var c = a.mats[b];
                    c.is2d ? this.addLineMaterial(b, c) : this.addHDRMaterial(b, c)
                }
                for (var b in a.matsNonHDR) this.addMaterialNonHDR(b, a.matsNonHDR[b]);
                for (var d in a.textures) this._textures[d] = a.textures[d]
            },
            f.prototype.cloneMaterial = function(a, b) {
                var c = a.isPrismMaterial ? e(a) : a.clone();
                if (a.defines && (c.defines = av.ObjectAssign({},
                        a.defines)), (c instanceof THREE.MeshPhongMaterial || c.isPrismMaterial) && (c.packedNormals = a.packedNormals, c.exposureBias = a.exposureBias, c.irradianceMap = a.irradianceMap, c.envMapExposure = a.envMapExposure, c.envRotationSin = a.envRotationSin, c.envRotationCos = a.envRotationCos, c.proteinType = a.proteinType, c.proteinMat = a.proteinMat, c.tonemapOutput = a.tonemapOutput, c.cutplanes = a.cutplanes, c.textureMaps = a.textureMaps, c.texturesLoaded = a.texturesLoaded), a.is2d && (c.is2d = !0), a.textureMaps) for (var d in a.textureMaps) if (a[d]) c[d] = a[d];
                else if (b) {
                    var f = c.textureMaps[d],
                        g = f.uri,
                        h = f.mapName,
                        i = this._getTextureHash(b, g, h),
                        j = this._textures[i];
                    j ? (j.mats.push(c), j.slots.push(d)) : avp.logger.error("Missing texture receiver", i)
                }
                return this._applyMRTFlags(c),
                    c
            },
            f.prototype.cleanup = function(a) {
                var b = this._getModelHash(a),
                    c = {};
                for (var d in this._textures) {
                    var e = this._textures[d]; - 1 === d.indexOf(b) ? c[d] = e: e.tex && (e.tex.dispose(), e.tex.needsUpdate = !0)
                }
                this._textures = c;
                var f = {},
                    g = {
                        type: "dispose"
                    };
                for (var h in this._materials) if (a && -1 === h.indexOf(b)) f[h] = this._materials[h];
                else {
                    var i = this._materials[h];
                    if (i.dispatchEvent(g), i.needsUpdate = !0, i.envMap = null, i.is2d) {
                        i.uniforms.tLayerMask.value = null,
                            i.uniforms.tLineStyle.value = null;
                        var j = i.uniforms.tRaster;
                        j && j.value instanceof THREE.Texture && (j.value.dispose(), j.value.needsUpdate = !0)
                    }
                }
                this._materials = f;
                var k = {};
                for (var h in this._materialsNonHDR) if (a && -1 === h.indexOf(b)) k[h] = this._materialsNonHDR[h];
                else {
                    var i = this._materialsNonHDR[h];
                    i.dispatchEvent(g),
                        i.needsUpdate = !0
                }
                this._materialsNonHDR = k
            },
            f.prototype.setTonemapExposureBias = function(a) {
                this._exposureBias = a;
                var b = Math.pow(2, a);
                this.forEach(function(a) {
                    a.exposureBias = b,
                        a.needsUpdate = !0
                })
            },
            f.prototype.setTonemapMethod = function(a) {
                this._tonemapMethod = a,
                    this.forEach(function(b) {
                        b.tonemapOutput = a,
                            b.needsUpdate = !0
                    })
            },
            f.prototype.setEnvExposure = function(a) {
                var b = Math.pow(2, a);
                this._envMapExposure = b,
                    this.forEach(function(a) {
                        a.envMapExposure = b,
                            a.needsUpdate = !0
                    })
            },
            f.prototype.setEnvRotation = function(a) {
                var b = this._envRotationSin = Math.sin(a),
                    c = this._envRotationCos = Math.cos(a);
                this.forEach(function(a) {
                    a.envRotationSin = b,
                        a.envRotationCos = c,
                        a.needsUpdate = !0
                })
            },
            f.prototype.setReflectionMap = function(a) {
                this._reflectionMap = a,
                    this.forEach(function(b) {
                        b.disableEnvMap || (b.envMap = a, b.needsUpdate = !0)
                    })
            },
            f.prototype.setIrradianceMap = function(a) {
                this._irradianceMap = a,
                    this.forEach(function(b) {
                        b.disableEnvMap || (b.irradianceMap = a, b.needsUpdate = !0)
                    })
            },
            f.prototype.setCutPlanes = function(a) {
                if (this._cutplanes.length !== (a ? a.length || 0 : 0)) {
                    this.forEach(function(b) {
                        b.doNotCut || (b.needsUpdate = !0, a && a.length > 0 && (b.side = THREE.DoubleSide))
                    });
                    for (var b in this._materialsNonHDR) this._materialsNonHDR[b].doNotCut || (this._materialsNonHDR[b].needsUpdate = !0)
                }
                for (; this._cutplanes.length > 0;) this._cutplanes.pop();
                if (a) for (var c = 0; c < a.length; c++) this._cutplanes.push(a[c].clone())
            },
            f.prototype.getCutPlanes = function() {
                return this._cutplanes.slice()
            },
            f.prototype.getCutPlanesRaw = function() {
                return this._cutplanes
            },
            f.prototype._applyPolygonOffset = function(a) { (a instanceof THREE.MeshPhongMaterial || a.isPrismMaterial) && (a.polygonOffset = this._polygonOffsetOn, a.polygonOffsetFactor = this._polygonOffsetFactor, a.polygonOffsetUnits = this._polygonOffsetUnits, a.extraDepthOffset && (a.polygonOffsetFactor += a.extraDepthOffset), a.needsUpdate = !0)
            },
            f.prototype.togglePolygonOffset = function(a, b, c) {
                this._polygonOffsetOn = a,
                    this._polygonOffsetFactor = a ? b || 1 : 0,
                    this._polygonOffsetUnits = a ? c || .1 : 0;
                var d = this;
                this.forEach(function(a) {
                    d._applyPolygonOffset(a)
                })
            },
            f.prototype._applyMRTFlags = function(a) {
                var b = a instanceof THREE.MeshPhongMaterial || a.isPrismMaterial,
                    c = a.mrtNormals,
                    d = a.mrtIdBuffer,
                    e = this._renderer && this._renderer.supportsMRT();
                a.mrtNormals = b && e && this._mrtNormals,
                    a.mrtIdBuffer = e ? this._mrtIdBuffer: void 0,
                a.mrtNormals === c && a.mrtIdBuffer === d || (a.needsUpdate = !0)
            },
            f.prototype.toggleMRTSetting = function(a) {
                this._mrtNormals = a.mrtNormals,
                    this._mrtIdBuffer = a.mrtIdBuffer;
                var b = this;
                this.forEach(function(a) {
                    a.is2d || b._applyMRTFlags(a)
                })
            },
            f.prototype.initLineStyleTexture = function() {
                this._lineStyleTex = d()
            },
            f.prototype.initLayersTexture = function(a, b) {
                for (var c = new Uint8Array(65536), d = 0, e = a; d < e; d++) c[d] = 255;
                var f = new THREE.DataTexture(c, 256, 256, THREE.LuminanceFormat, THREE.UnsignedByteType, THREE.UVMapping, THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping, THREE.NearestFilter, THREE.NearestFilter, 0);
                f.generateMipmaps = !1,
                    f.flipY = !1,
                    f.needsUpdate = !0,
                    this._layerMaskTex = f,
                    this._layersMap = b
            },
            f.prototype.setLayerVisible = function(a, b) {
                for (var c = this._layerMaskTex,
                         d = c.image.data,
                         e = this._layersMap,
                         f = b ? 255 : 0, g = 0; g < a.length; ++g) {
                    d[e[a[g]]] = f
                }
                c.needsUpdate = !0,
                    this.forEach(function(a) {
                        a.is2d && (a.needsUpdate = !0)
                    })
            },
            f.prototype.isLayerVisible = function(a) {
                return !! this._layerMaskTex.image.data[this._layersMap[a]]
            },
            f.prototype.initSelectionTexture = function(a) {
                for (var b = a || 1,
                         c = 0 | Math.ceil(b / 4096), d = 1; d < c;) d *= 2;
                c = d;
                for (var e = new Uint8Array(4096 * c), f = 0; f < b; f++) e[f] = 0;
                var g = new THREE.DataTexture(e, 4096, c, THREE.LuminanceFormat, THREE.UnsignedByteType, THREE.UVMapping, THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping, THREE.NearestFilter, THREE.NearestFilter, 0);
                g.generateMipmaps = !1,
                    g.flipY = !1,
                    g.needsUpdate = !0,
                    this._selectionTex = g
            },
            f.prototype.setSelectionTexture = function(a) {
                if (this._selectionTex) {
                    var b = this._selectionTex.image;
                    a.uniforms.tSelectionTexture.value = this._selectionTex,
                        a.uniforms.vSelTexSize.value.set(b.width, b.height),
                        a.needsUpdate = !0
                }
            },
            f.prototype.updatePixelScale = function(a) {
                var b = this._pixelsPerUnit = a;
                this.forEach(function(a) {
                    a.is2d && (a.uniforms.aaRange.value = .5 / (b * a.modelScale), a.uniforms.pixelsPerUnit.value = b * a.modelScale)
                })
            },
            f.prototype.updateSwapBlackAndWhite = function(a) {
                var b = this._swapBlackAndWhite = a ? 1 : 0;
                this.forEach(function(a) {
                    a.is2d && (a.uniforms.swap.value = b)
                })
            },
            f.prototype.updateViewportId = function(a) {
                this.forEach(function(b) {
                    b.is2d && (b.uniforms.viewportId.value = a, b.needsUpdate = !0)
                })
            },
            a.exports = f
    },
    function(a, b) {
        "use strict";
        var c = [{
                id: "SOLID",
                name: "Solid",
                ascii_art: "_______________________________________",
                def: [1]
            },
                {
                    id: "BORDER",
                    name: "Border",
                    ascii_art: "__ __ . __ __ . __ __ . __ __ . __ __ .",
                    def: [.5, -.25, .5, -.25, 0, -.25]
                },
                {
                    id: "BORDER2",
                    name: "Border (.5x)",
                    ascii_art: "__ __ . __ __ . __ __ . __ __ . __ __ .",
                    def: [.25, -.125, .25, -.125, 0, -.125]
                },
                {
                    id: "BORDERX2",
                    name: "Border (2x)",
                    ascii_art: "____  ____  .  ____  ____  .  ___",
                    def: [1, -.5, 1, -.5, 0, -.5]
                },
                {
                    id: "CENTER",
                    name: "Center",
                    ascii_art: "____ _ ____ _ ____ _ ____ _ ____ _ ____",
                    def: [1.25, -.25, .25, -.25]
                },
                {
                    id: "CENTER2",
                    name: "Center (.5x)",
                    ascii_art: "___ _ ___ _ ___ _ ___ _ ___ _ ___",
                    def: [.75, -.125, .125, -.125]
                },
                {
                    id: "CENTERX2",
                    name: "Center (2x)",
                    ascii_art: "________  __  ________  __  _____",
                    def: [2.5, -.5, .5, -.5]
                },
                {
                    id: "DASHDOT",
                    name: "Dash dot",
                    ascii_art: "__ . __ . __ . __ . __ . __ . __ . __",
                    def: [.5, -.25, 0, -.25]
                },
                {
                    id: "DASHDOT2",
                    name: "Dash dot (.5x)",
                    ascii_art: "_._._._._._._._._._._._._._._.",
                    def: [.25, -.125, 0, -.125]
                },
                {
                    id: "DASHDOTX2",
                    name: "Dash dot (2x)",
                    ascii_art: "____  .  ____  .  ____  .  ___",
                    def: [1, -.5, 0, -.5]
                },
                {
                    id: "DASHED",
                    name: "Dashed",
                    ascii_art: "__ __ __ __ __ __ __ __ __ __ __ __ __ _",
                    def: [.5, -.25]
                },
                {
                    id: "DASHED2",
                    name: "Dashed (.5x)",
                    ascii_art: "_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _",
                    def: [.25, -.125]
                },
                {
                    id: "DASHEDX2",
                    name: "Dashed (2x)",
                    ascii_art: "____  ____  ____  ____  ____  ___",
                    def: [1, -.5]
                },
                {
                    id: "DIVIDE",
                    name: "Divide",
                    ascii_art: "____ . . ____ . . ____ . . ____ . . ____",
                    def: [.5, -.25, 0, -.25, 0, -.25]
                },
                {
                    id: "DIVIDE2",
                    name: "Divide (.5x)",
                    ascii_art: "__..__..__..__..__..__..__..__.._",
                    def: [.25, -.125, 0, -.125, 0, -.125]
                },
                {
                    id: "DIVIDEX2",
                    name: "Divide (2x)",
                    ascii_art: "________  .  .  ________  .  .  _",
                    def: [1, -.5, 0, -.5, 0, -.5]
                },
                {
                    id: "DOT",
                    name: "Dot",
                    ascii_art: ". . . . . . . . . . . . . . . . . . . . . . . .",
                    def: [0, -.25]
                },
                {
                    id: "DOT2",
                    name: "Dot (.5x)",
                    ascii_art: "........................................",
                    def: [0, -.125]
                },
                {
                    id: "DOTX2",
                    name: "Dot (2x)",
                    ascii_art: ".  .  .  .  .  .  .  .  .  .  .  .  .  .",
                    def: [0, -.5]
                },
                {
                    id: "HIDDEN",
                    name: "Hidden",
                    ascii_art: "__ __ __ __ __ __ __ __ __ __ __ __ __ __",
                    def: [.25, -.125]
                },
                {
                    id: "HIDDEN2",
                    name: "Hidden (.5x)",
                    ascii_art: "_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _",
                    def: [.125, -.0625]
                },
                {
                    id: "HIDDENX2",
                    name: "Hidden (2x)",
                    ascii_art: "____ ____ ____ ____ ____ ____ ____",
                    def: [.5, -.25]
                },
                {
                    id: "PHANTOM",
                    name: "Phantom",
                    ascii_art: "______  __  __  ______  __  __  ______",
                    def: [1.25, -.25, .25, -.25, .25, -.25]
                },
                {
                    id: "PHANTOM2",
                    name: "Phantom (.5x)",
                    ascii_art: "___ _ _ ___ _ _ ___ _ _ ___ _ _",
                    def: [.625, -.125, .125, -.125, .125, -.125]
                },
                {
                    id: "PHANTOMX2",
                    name: "Phantom (2x)",
                    ascii_art: "____________    ____    ____   _",
                    def: [2.5, -.5, .5, -.5, .5, -.5]
                },
                {
                    id: "ACAD_ISO02W100",
                    name: "ISO dash",
                    ascii_art: "__ __ __ __ __ __ __ __ __ __ __ __ __",
                    def: [12, -3],
                    pen_width: 1,
                    unit: "mm"
                },
                {
                    id: "ACAD_ISO03W100",
                    name: "ISO dash space",
                    ascii_art: "__    __    __    __    __    __",
                    def: [12, -18],
                    pen_width: 1,
                    unit: "mm"
                },
                {
                    id: "ACAD_ISO04W100",
                    name: "ISO long-dash dot",
                    ascii_art: "____ . ____ . ____ . ____ . _",
                    def: [24, -3, .5, -3],
                    pen_width: 1,
                    unit: "mm"
                },
                {
                    id: "ACAD_ISO05W100",
                    name: "ISO long-dash double-dot",
                    ascii_art: "____ .. ____ .. ____ .",
                    def: [24, -3, .5, -3, .5, -3],
                    pen_width: 1,
                    unit: "mm"
                },
                {
                    id: "ACAD_ISO06W100",
                    name: "ISO long-dash triple-dot",
                    ascii_art: "____ ... ____ ... ____",
                    def: [24, -3, .5, -3, .5, -3, .5, -3],
                    pen_width: 1,
                    unit: "mm"
                },
                {
                    id: "ACAD_ISO07W100",
                    name: "ISO dot",
                    ascii_art: ". . . . . . . . . . . . . . . . . . . .",
                    def: [.5, -3],
                    pen_width: 1,
                    unit: "mm"
                },
                {
                    id: "ACAD_ISO08W100",
                    name: "ISO long-dash short-dash",
                    ascii_art: "____ __ ____ __ ____ _",
                    def: [24, -3, 6, -3],
                    pen_width: 1,
                    unit: "mm"
                },
                {
                    id: "ACAD_ISO09W100",
                    name: "ISO long-dash double-short-dash",
                    ascii_art: "____ __ __ ____",
                    def: [24, -3, 6, -3, 6, -3],
                    pen_width: 1,
                    unit: "mm"
                },
                {
                    id: "ACAD_ISO10W100",
                    name: "ISO dash dot",
                    ascii_art: "__ . __ . __ . __ . __ . __ . __ . ",
                    def: [12, -3, .5, -3],
                    pen_width: 1,
                    unit: "mm"
                },
                {
                    id: "ACAD_ISO11W100",
                    name: "ISO double-dash dot",
                    ascii_art: "__ __ . __ __ . __ __ . __ _",
                    def: [12, -3, 12, -3, .5, -3],
                    pen_width: 1,
                    unit: "mm"
                },
                {
                    id: "ACAD_ISO12W100",
                    name: "ISO dash double-dot",
                    ascii_art: "__ . . __ . . __ . . __ . .",
                    def: [12, -3, .5, -3, .5, -3],
                    pen_width: 1,
                    unit: "mm"
                },
                {
                    id: "ACAD_ISO13W100",
                    name: "ISO double-dash double-dot",
                    ascii_art: "__ __ . . __ __ . . _",
                    def: [12, -3, 12, -3, .5, -3, .5, -3],
                    pen_width: 1,
                    unit: "mm"
                },
                {
                    id: "ACAD_ISO14W100",
                    name: "ISO dash triple-dot",
                    ascii_art: "__ . . . __ . . . __ . . . _",
                    def: [12, -3, .5, -3, .5, -3, .5, -3],
                    pen_width: 1,
                    unit: "mm"
                },
                {
                    id: "ACAD_ISO15W100",
                    name: "ISO double-dash triple-dot",
                    ascii_art: "__ __ . . . __ __ . .",
                    def: [12, -3, 12, -3, .5, -3, .5, -3, .5, -3],
                    pen_width: 1,
                    unit: "mm"
                },
                {
                    id: "FENCELINE1",
                    name: "Fenceline circle",
                    ascii_art: "----0-----0----0-----0----0-----0--",
                    def: [.25, -.1, ["CIRC1", "ltypeshp.shx", "x=-.1", "s=.1"], -.1, 1]
                },
                {
                    id: "FENCELINE2",
                    name: "Fenceline square",
                    ascii_art: "----[]-----[]----[]-----[]----[]---",
                    def: [.25, -.1, ["BOX", "ltypeshp.shx", "x=-.1", "s=.1"], -.1, 1]
                },
                {
                    id: "TRACKS",
                    name: "Tracks",
                    ascii_art: "-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-",
                    def: [.15, ["TRACK1", "ltypeshp.shx", "s=.25"], .15]
                },
                {
                    id: "BATTING",
                    name: "Batting",
                    ascii_art: "SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS",
                    def: [1e-4, -.1, ["BAT", "ltypeshp.shx", "x=-.1", "s=.1"], -.2, ["BAT", "ltypeshp.shx", "r=180", "x=.1", "s=.1"], -.1]
                },
                {
                    id: "HOT_WATER_SUPPLY",
                    name: "Hot water supply",
                    ascii_art: "---- HW ---- HW ---- HW ----",
                    def: [.5, -.2, ["HW", "STANDARD", "S=.1", "R=0.0", "X=-0.1", "Y=-.05"], -.2]
                },
                {
                    id: "GAS_LINE",
                    name: "Gas line",
                    ascii_art: "----GAS----GAS----GAS----GAS----GAS----GAS--",
                    def: [.5, -.2, ["GAS", "STANDARD", "S=.1", "R=0.0", "X=-0.1", "Y=-.05"], -.25]
                },
                {
                    id: "ZIGZAG",
                    name: "Zig zag",
                    ascii_art: "/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/",
                    def: [1e-4, -.2, ["ZIG", "ltypeshp.shx", "x=-.2", "s=.2"], -.4, ["ZIG", "ltypeshp.shx", "r=180", "x=.2", "s=.2"], -.2]
                }],
            d = function() {
                for (var a = c.length,
                         b = 0,
                         d = 0; d < a; d++) {
                    var e = c[d];
                    e.def.length > b && (b = e.def.length)
                }
                for (var f = b + 3,
                         g = a,
                         h = 1; h < f;) h *= 2;
                for (f = h, h = 1; h < g;) h *= 2;
                g = h;
                for (var i = new Uint8Array(f * g), j = 0; j < a; j++) {
                    for (var k = j * f,
                             e = c[j], l = e.unit && "mm" == e.unit ? 1 / 25.4 : 1, m = e.pen_width || 0, n = e.def, o = 0, d = 0; d < n.length; d++) {
                        var p = Math.abs(n[d]);
                        p <= .5 * m && (p = 0);
                        var q = 0 | 96 * p * l;
                        o += q,
                            i[k + d + 2] = q || 1
                    }
                    i[k] = o % 256,
                        i[k + 1] = o / 256,
                        i[k + n.length + 2] = 0
                }
                var r = new THREE.DataTexture(i, f, g, THREE.LuminanceFormat, THREE.UnsignedByteType, THREE.UVMapping, THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping, THREE.NearestFilter, THREE.NearestFilter, 0);
                return r.generateMipmaps = !1,
                    r.flipY = !1,
                    r.needsUpdate = !0,
                    r
            };
        a.exports = {
            LineStyleDefs: c,
            CreateLinePatternTexture: d
        }
    },
    function(a, b, c) {
        "use strict";
        function d(a) {
            var b = a + "_texMatrix",
                c = a + "_invert",
                d = {};
            return d[a] = {
                type: "t",
                value: null
            },
                d[b] = {
                    type: "m3",
                    value: new THREE.Matrix3
                },
                d[c] = {
                    type: "i",
                    value: 0
                },
                d
        }
        function e(a) {
            var b = a + "_texMatrix",
                c = a + "_bumpScale",
                d = a + "_bumpmapType",
                e = {};
            return e[a] = {
                type: "t",
                value: null
            },
                e[b] = {
                    type: "m3",
                    value: new THREE.Matrix3
                },
                e[c] = {
                    type: "v2",
                    value: new THREE.Vector2(1, 1)
                },
                e[d] = {
                    type: "i",
                    value: 0
                },
                e
        }
        var f = c(5),
            g = c(66),
            h = {
                uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib.common, THREE.UniformsLib.lights, THREE.UniformsLib.fog, f.CutPlanesUniforms, f.IdUniforms, f.ThemingUniform, f.ShadowMapUniforms, d("surface_albedo_map"), d("surface_roughness_map"), d("surface_cutout_map"), d("surface_anisotropy_map"), d("surface_rotation_map"), d("opaque_albedo_map"), d("opaque_f0_map"), d("opaque_luminance_modifier_map"), d("layered_bottom_f0_map"), d("layered_f0_map"), d("layered_diffuse_map"), d("layered_fraction_map"), d("layered_roughness_map"), d("layered_anisotropy_map"), d("layered_rotation_map"), d("metal_f0_map"), d("wood_curly_distortion_map"), e("surface_normal_map"), e("layered_normal_map"), {
                    surface_albedo: {
                        type: "c",
                        value: new THREE.Color(1118481)
                    },
                    surface_roughness: {
                        type: "f",
                        value: 1
                    },
                    surface_anisotropy: {
                        type: "f",
                        value: 1
                    },
                    surface_rotation: {
                        type: "f",
                        value: 1
                    },
                    opaque_albedo: {
                        type: "c",
                        value: new THREE.Color(1118481)
                    },
                    opaque_f0: {
                        type: "f",
                        value: 1
                    },
                    opaque_luminance_modifier: {
                        type: "c",
                        value: new THREE.Color(1118481)
                    },
                    opaque_luminance: {
                        type: "f",
                        value: 1
                    },
                    metal_f0: {
                        type: "c",
                        value: new THREE.Color(1118481)
                    },
                    layered_f0: {
                        type: "f",
                        value: 1
                    },
                    layered_diffuse: {
                        type: "c",
                        value: new THREE.Color(0)
                    },
                    layered_fraction: {
                        type: "f",
                        value: 1
                    },
                    layered_bottom_f0: {
                        type: "c",
                        value: new THREE.Color(1118481)
                    },
                    layered_roughness: {
                        type: "f",
                        value: 1
                    },
                    layered_anisotropy: {
                        type: "f",
                        value: 1
                    },
                    layered_rotation: {
                        type: "f",
                        value: 1
                    },
                    transparent_ior: {
                        type: "f",
                        value: 2
                    },
                    transparent_color: {
                        type: "c",
                        value: new THREE.Color(1118481)
                    },
                    transparent_distance: {
                        type: "f",
                        value: 1
                    },
                    wood_fiber_cosine_enable: {
                        type: "i",
                        value: 1
                    },
                    wood_fiber_cosine_bands: {
                        type: "i",
                        value: 2
                    },
                    wood_fiber_cosine_weights: {
                        type: "v4",
                        value: new THREE.Vector4(2.5, .5, 1, 1)
                    },
                    wood_fiber_cosine_frequencies: {
                        type: "v4",
                        value: new THREE.Vector4(15, 4, 1, 1)
                    },
                    wood_fiber_perlin_enable: {
                        type: "i",
                        value: 1
                    },
                    wood_fiber_perlin_bands: {
                        type: "i",
                        value: 3
                    },
                    wood_fiber_perlin_weights: {
                        type: "v4",
                        value: new THREE.Vector4(3, 1, .2, 1)
                    },
                    wood_fiber_perlin_frequencies: {
                        type: "v4",
                        value: new THREE.Vector4(40, 20, 3.5, 1)
                    },
                    wood_fiber_perlin_scale_z: {
                        type: "f",
                        value: .3
                    },
                    wood_growth_perlin_enable: {
                        type: "i",
                        value: 1
                    },
                    wood_growth_perlin_bands: {
                        type: "i",
                        value: 3
                    },
                    wood_growth_perlin_weights: {
                        type: "v4",
                        value: new THREE.Vector4(1, 2, 1, 1)
                    },
                    wood_growth_perlin_frequencies: {
                        type: "v4",
                        value: new THREE.Vector4(1, 5, 13, 1)
                    },
                    wood_latewood_ratio: {
                        type: "f",
                        value: .238
                    },
                    wood_earlywood_sharpness: {
                        type: "f",
                        value: .395
                    },
                    wood_latewood_sharpness: {
                        type: "f",
                        value: .109
                    },
                    wood_ring_thickness: {
                        type: "f",
                        value: .75
                    },
                    wood_earlycolor_perlin_enable: {
                        type: "i",
                        value: 1
                    },
                    wood_earlycolor_perlin_bands: {
                        type: "i",
                        value: 2
                    },
                    wood_earlycolor_perlin_weights: {
                        type: "v4",
                        value: new THREE.Vector4(.3, .5, .15, 1)
                    },
                    wood_earlycolor_perlin_frequencies: {
                        type: "v4",
                        value: new THREE.Vector4(8, 3, .35, 1)
                    },
                    wood_early_color: {
                        type: "c",
                        value: new THREE.Color(.286, .157, .076)
                    },
                    wood_use_manual_late_color: {
                        type: "i",
                        value: 0
                    },
                    wood_manual_late_color: {
                        type: "c",
                        value: new THREE.Color(.62, .35, .127)
                    },
                    wood_latecolor_perlin_enable: {
                        type: "i",
                        value: 1
                    },
                    wood_latecolor_perlin_bands: {
                        type: "i",
                        value: 1
                    },
                    wood_latecolor_perlin_weights: {
                        type: "v4",
                        value: new THREE.Vector4(.75, .55, 1, 1)
                    },
                    wood_latecolor_perlin_frequencies: {
                        type: "v4",
                        value: new THREE.Vector4(4.5, .05, 1, 1)
                    },
                    wood_late_color_power: {
                        type: "f",
                        value: 1.25
                    },
                    wood_diffuse_perlin_enable: {
                        type: "i",
                        value: 1
                    },
                    wood_diffuse_perlin_bands: {
                        type: "i",
                        value: 3
                    },
                    wood_diffuse_perlin_weights: {
                        type: "v4",
                        value: new THREE.Vector4(.15, .2, .05, 1)
                    },
                    wood_diffuse_perlin_frequencies: {
                        type: "v4",
                        value: new THREE.Vector4(.05, .1, 3, 1)
                    },
                    wood_diffuse_perlin_scale_z: {
                        type: "f",
                        value: .2
                    },
                    wood_use_pores: {
                        type: "i",
                        value: 1
                    },
                    wood_pore_type: {
                        type: "i",
                        value: 0
                    },
                    wood_pore_radius: {
                        type: "f",
                        value: .04
                    },
                    wood_pore_cell_dim: {
                        type: "f",
                        value: .15
                    },
                    wood_pore_color_power: {
                        type: "f",
                        value: 1.45
                    },
                    wood_pore_depth: {
                        type: "f",
                        value: .02
                    },
                    wood_use_rays: {
                        type: "i",
                        value: 1
                    },
                    wood_ray_color_power: {
                        type: "f",
                        value: 1.1
                    },
                    wood_ray_seg_length_z: {
                        type: "f",
                        value: 5
                    },
                    wood_ray_num_slices: {
                        type: "f",
                        value: 160
                    },
                    wood_ray_ellipse_z2x: {
                        type: "f",
                        value: 10
                    },
                    wood_ray_ellipse_radius_x: {
                        type: "f",
                        value: .2
                    },
                    wood_use_latewood_bump: {
                        type: "i",
                        value: 1
                    },
                    wood_latewood_bump_depth: {
                        type: "f",
                        value: .01
                    },
                    wood_use_groove_roughness: {
                        type: "i",
                        value: 1
                    },
                    wood_groove_roughness: {
                        type: "f",
                        value: .85
                    },
                    wood_diffuse_lobe_weight: {
                        type: "f",
                        value: .9
                    },
                    wood_curly_distortion_enable: {
                        type: "i",
                        value: 0
                    },
                    wood_curly_distortion_scale: {
                        type: "f",
                        value: .25
                    },
                    wood_ring_fraction: {
                        type: "v4",
                        value: new THREE.Vector4(0, 0, 0, 0)
                    },
                    wood_fall_rise: {
                        type: "v2",
                        value: new THREE.Vector2(0, 0)
                    },
                    permutationMap: {
                        type: "t",
                        value: null
                    },
                    gradientMap: {
                        type: "t",
                        value: null
                    },
                    perm2DMap: {
                        type: "t",
                        value: null
                    },
                    permGradMap: {
                        type: "t",
                        value: null
                    },
                    importantSamplingRandomMap: {
                        type: "t",
                        value: null
                    },
                    importantSamplingSolidAngleMap: {
                        type: "t",
                        value: null
                    },
                    irradianceMap: {
                        type: "t",
                        value: null
                    },
                    envMap: {
                        type: "t",
                        value: null
                    },
                    exposureBias: {
                        type: "f",
                        value: 1
                    },
                    envMapExposure: {
                        type: "f",
                        value: 1
                    },
                    envRotationSin: {
                        type: "f",
                        value: 0
                    },
                    envRotationCos: {
                        type: "f",
                        value: 1
                    },
                    envExponentMin: {
                        type: "f",
                        value: 1
                    },
                    envExponentMax: {
                        type: "f",
                        value: 512
                    },
                    envExponentCount: {
                        type: "f",
                        value: 10
                    }
                }]),
                vertexShader: c(92),
                fragmentShader: c(93)
            };
        THREE.ShaderLib.prism = h;
        var i = function() {
                var a = g.createShaderMaterial(h);
                return a.defaultAttributeValues.uvw = [0, 0, 0],
                    a.enable3DWoodBump = !1,
                    a.enableImportantSampling = !1,
                    a.mapList = {},
                    a.isPrismMaterial = !0,
                    a
            },
            j = function(a) {
                var b = i();
                switch (b.name = a.name, b.side = a.side, b.opacity = a.opacity, b.transparent = a.transparent, b.blending = a.blending, b.blendSrc = a.blendSrc, b.blendDst = a.blendDst, b.blendEquation = a.blendEquation, b.blendSrcAlpha = a.blendSrcAlpha, b.blendDstAlpha = a.blendDstAlpha, b.blendEquationAlpha = a.blendEquationAlpha, b.depthTest = a.depthTest, b.depthWrite = a.depthWrite, b.polygonOffset = a.polygonOffset, b.polygonOffsetFactor = a.polygonOffsetFactor, b.polygonOffsetUnits = a.polygonOffsetUnits, b.alphaTest = a.alphaTest, b.overdraw = a.overdraw, b.visible = a.visible, b.mapList = a.mapList, b.prismType = a.prismType, b.surface_albedo = a.surface_albedo, void 0 !== a.surface_albedo_map && (b.surface_albedo_map = a.surface_albedo_map), b.surface_roughness = a.surface_roughness, void 0 !== a.surface_roughness_map && (b.surface_roughness_map = a.surface_roughness_map), b.surface_anisotropy = a.surface_anisotropy, void 0 !== a.surface_anisotropy_map && (b.surface_anisotropy_map = a.surface_anisotropy_map), b.surface_rotation = a.surface_rotation, void 0 !== a.surface_rotation_map && (b.surface_rotation_map = a.surface_rotation_map), void 0 !== a.surface_cutout_map && (b.surface_cutout_map = a.surface_cutout_map), void 0 !== a.surface_normal_map && (b.surface_normal_map = a.surface_normal_map), b.uniforms.importantSamplingRandomMap.value = a.uniforms.importantSamplingRandomMap.value, b.uniforms.importantSamplingSolidAngleMap.value = a.uniforms.importantSamplingSolidAngleMap.value, b.prismType) {
                    case "PrismOpaque":
                        b.opaque_albedo = (new THREE.Color).copy(a.opaque_albedo),
                            b.opaque_luminance_modifier = (new THREE.Color).copy(a.opaque_luminance_modifier),
                            b.opaque_f0 = a.opaque_f0,
                            b.opaque_luminance = a.opaque_luminance,
                        void 0 !== a.opaque_albedo_map && (b.opaque_albedo_map = a.opaque_albedo_map),
                        void 0 !== a.opaque_luminance_modifier_map && (b.opaque_luminance_modifier_map = a.opaque_luminance_modifier_map),
                        void 0 !== a.opaque_f0_map && (b.opaque_f0_map = a.opaque_f0_map);
                        break;
                    case "PrismMetal":
                        b.metal_f0 = (new THREE.Color).copy(a.metal_f0),
                        void 0 !== a.metal_f0_map && (b.metal_f0_map = a.metal_f0_map);
                        break;
                    case "PrismLayered":
                        b.layered_f0 = a.layered_f0,
                            b.layered_diffuse = (new THREE.Color).copy(a.layered_diffuse),
                            b.layered_fraction = a.layered_fraction,
                            b.layered_bottom_f0 = (new THREE.Color).copy(a.layered_bottom_f0),
                            b.layered_roughness = a.layered_roughness,
                            b.layered_anisotropy = a.layered_anisotropy,
                            b.layered_rotation = a.layered_rotation,
                        void 0 !== a.layered_bottom_f0_map && (b.layered_bottom_f0_map = a.layered_bottom_f0_map),
                        void 0 !== a.layered_f0_map && (b.layered_f0_map = a.layered_f0_map),
                        void 0 !== a.layered_diffuse_map && (b.layered_diffuse_map = a.layered_diffuse_map),
                        void 0 !== a.layered_fraction_map && (b.layered_fraction_map = a.layered_fraction_map),
                        void 0 !== a.layered_rotationlayered_roughness_map && (b.layered_rotationlayered_roughness_map = a.layered_rotationlayered_roughness_map),
                        void 0 !== a.layered_anisotropy_map && (b.layered_anisotropy_map = a.layered_anisotropy_map),
                        void 0 !== a.layered_rotation_map && (b.layered_rotation_map = a.layered_rotation_map),
                        void 0 !== a.layered_normal_map && (b.layered_normal_map = a.layered_normal_map);
                        break;
                    case "PrismTransparent":
                        b.transparent_color = (new THREE.Color).copy(a.transparent_color),
                            b.transparent_distance = a.transparent_distance,
                            b.transparent_ior = a.transparent_ior,
                            b.transparent = a.transparent,
                            b.twoPassTransparency = a.twoPassTransparency;
                        break;
                    case "PrismWood":
                        b.wood_fiber_cosine_enable = a.wood_fiber_cosine_enable,
                            b.wood_fiber_cosine_bands = a.wood_fiber_cosine_bands,
                            b.wood_fiber_cosine_weights = (new THREE.Vector4).copy(a.wood_fiber_cosine_weights),
                            b.wood_fiber_cosine_frequencies = (new THREE.Vector4).copy(a.wood_fiber_cosine_frequencies),
                            b.wood_fiber_perlin_enable = a.wood_fiber_perlin_enable,
                            b.wood_fiber_perlin_bands = a.wood_fiber_perlin_bands,
                            b.wood_fiber_perlin_weights = (new THREE.Vector4).copy(a.wood_fiber_perlin_weights),
                            b.wood_fiber_perlin_frequencies = (new THREE.Vector4).copy(a.wood_fiber_perlin_frequencies),
                            b.wood_fiber_perlin_scale_z = a.wood_fiber_perlin_scale_z,
                            b.wood_growth_perlin_enable = a.wood_growth_perlin_enable,
                            b.wood_growth_perlin_bands = a.wood_growth_perlin_bands,
                            b.wood_growth_perlin_weights = (new THREE.Vector4).copy(a.wood_growth_perlin_weights),
                            b.wood_growth_perlin_frequencies = (new THREE.Vector4).copy(a.wood_growth_perlin_frequencies),
                            b.wood_latewood_ratio = a.wood_latewood_ratio,
                            b.wood_earlywood_sharpness = a.wood_earlywood_sharpness,
                            b.wood_latewood_sharpness = a.wood_latewood_sharpness,
                            b.wood_ring_thickness = a.wood_ring_thickness,
                            b.wood_earlycolor_perlin_enable = a.wood_earlycolor_perlin_enable,
                            b.wood_earlycolor_perlin_bands = a.wood_earlycolor_perlin_bands,
                            b.wood_earlycolor_perlin_weights = (new THREE.Vector4).copy(a.wood_earlycolor_perlin_weights),
                            b.wood_earlycolor_perlin_frequencies = (new THREE.Vector4).copy(a.wood_earlycolor_perlin_frequencies),
                            b.wood_early_color = (new THREE.Color).copy(a.wood_early_color),
                            b.wood_use_manual_late_color = a.wood_use_manual_late_color,
                            b.wood_manual_late_color = (new THREE.Color).copy(a.wood_manual_late_color),
                            b.wood_latecolor_perlin_enable = a.wood_latecolor_perlin_enable,
                            b.wood_latecolor_perlin_bands = a.wood_latecolor_perlin_bands,
                            b.wood_latecolor_perlin_weights = (new THREE.Vector4).copy(a.wood_latecolor_perlin_weights),
                            b.wood_latecolor_perlin_frequencies = (new THREE.Vector4).copy(a.wood_latecolor_perlin_frequencies),
                            b.wood_late_color_power = a.wood_late_color_power,
                            b.wood_diffuse_perlin_enable = a.wood_diffuse_perlin_enable,
                            b.wood_diffuse_perlin_bands = a.wood_diffuse_perlin_bands,
                            b.wood_diffuse_perlin_weights = (new THREE.Vector4).copy(a.wood_diffuse_perlin_weights),
                            b.wood_diffuse_perlin_frequencies = (new THREE.Vector4).copy(a.wood_diffuse_perlin_frequencies),
                            b.wood_diffuse_perlin_scale_z = a.wood_diffuse_perlin_scale_z,
                            b.wood_use_pores = a.wood_use_pores,
                            b.wood_pore_type = a.wood_pore_type,
                            b.wood_pore_radius = a.wood_pore_radius,
                            b.wood_pore_cell_dim = a.wood_pore_cell_dim,
                            b.wood_pore_color_power = a.wood_pore_color_power,
                            b.wood_pore_depth = a.wood_pore_depth,
                            b.wood_use_rays = a.wood_use_rays,
                            b.wood_ray_color_power = a.wood_ray_color_power,
                            b.wood_ray_seg_length_z = a.wood_ray_seg_length_z,
                            b.wood_ray_num_slices = a.wood_ray_num_slices,
                            b.wood_ray_ellipse_z2x = a.wood_ray_ellipse_z2x,
                            b.wood_ray_ellipse_radius_x = a.wood_ray_ellipse_radius_x,
                            b.wood_use_latewood_bump = a.wood_use_latewood_bump,
                            b.wood_latewood_bump_depth = a.wood_latewood_bump_depth,
                            b.wood_use_groove_roughness = a.wood_use_groove_roughness,
                            b.wood_groove_roughness = a.wood_groove_roughness,
                            b.wood_diffuse_lobe_weight = a.wood_diffuse_lobe_weight,
                            b.uniforms.permutationMap.value = a.uniforms.permutationMap.value,
                            b.uniforms.gradientMap.value = a.uniforms.gradientMap.value,
                            b.uniforms.perm2DMap.value = a.uniforms.perm2DMap.value,
                            b.uniforms.permGradMap.value = a.uniforms.permGradMap.value,
                        void 0 !== a.wood_curly_distortion_map && (b.wood_curly_distortion_map = a.wood_curly_distortion_map, b.wood_curly_distortion_enable = a.wood_curly_distortion_enable, b.wood_curly_distortion_scale = a.wood_curly_distortion_scale),
                            b.wood_ring_fraction = a.wood_ring_fraction,
                            b.wood_fall_rise = a.wood_fall_rise;
                        break;
                    default:
                        THREE.warn("Unknown prism type: " + a.prismType)
                }
                return b.envExponentMin = a.envExponentMin,
                    b.envExponentMax = a.envExponentMax,
                    b.envExponentCount = a.envExponentCount,
                    b.envMap = a.envMap,
                    b.defines = a.defines,
                    b
            };
        a.exports = {
            PrismShader: h,
            GetPrismMapUniforms: d,
            createPrismMaterial: i,
            clonePrismMaterial: j
        }
    },
    function(a, b) {
        a.exports = "varying vec3 vViewPosition;\nvarying vec3 vNormal;\n#if defined(PRISMWOOD) && !defined(NO_UVW)\nvarying vec3 vUvw;\n#if defined(PRISMWOODBUMP)\nvarying vec3 vtNormal;\nvarying mat3 mNormalMatrix;\n#endif\n#endif\n#if MAX_SPOT_LIGHTS > 0 || NUM_CUTPLANES > 0\nvarying vec3 vWorldPosition;\n#endif\n#prism_check<USE_MAP>\n#ifdef USE_MAP\nvarying vec2 vUv;\n#endif\n#ifdef USE_LOGDEPTHBUF\n#ifdef USE_LOGDEPTHBUF_EXT\nvarying float vFragDepth;\n#endif\nuniform float logDepthBufFC;\n#endif\n#ifdef MRT_NORMALS\nvarying float depth;\n#endif\n#include<pack_normals>\n#include<instancing_decl_vert>\n#include<id_decl_vert>\n#include<shadowmap_decl_vert>\n#if !defined(USE_MAP) && (MAX_DIR_LIGHTS > 0 || MAX_POINT_LIGHTS > 0 || MAX_SPOT_LIGHTS > 0) || defined( PRISMWOODBUMP )\nvarying vec3 vTangent;\nvarying vec3 vBitangent;\nvoid ComputeTangents(vec3 normal, out vec3 u, out vec3 v)\n{\n    float scale = normal.z < 0.0 ? -1.0 : 1.0;\n    vec3 temp = scale * normal;\n    float e    = temp.z;\n    float h    = 1.0/(1.0 + e);\n    float hvx  = h   *  temp.y;\n    float hvxy = hvx * -temp.x;\n    u = vec3(e + hvx * temp.y, hvxy,                -temp.x);\n    v = vec3(hvxy,             e + h * temp.x * temp.x, -temp.y);\n    u *= scale;\n    v *= scale;\n}\n#endif\nvoid main() {\n#ifdef USE_MAP\n    vUv = uv;\n#endif\n#ifdef UNPACK_NORMALS\n    vec3 objectNormal = decodeNormal(normal);\n#else\n    vec3 objectNormal = normal;\n#endif\n#ifdef FLIP_SIDED\n    objectNormal = -objectNormal;\n#endif\n    objectNormal = getInstanceNormal(objectNormal);\n    vec3 instPos = getInstancePos(position);\n#if defined(PRISMWOOD) && !defined(NO_UVW)\n#if defined(PRISMWOODBUMP)\n    vUvw = instPos;\n    vtNormal = normalize(objectNormal);\n    mNormalMatrix = normalMatrix;\n#else\n    vUvw = uvw;\n#endif\n#endif\n    vec3 transformedNormal = normalMatrix * objectNormal;\n    vNormal = normalize( transformedNormal );\n    vec4 mvPosition = modelViewMatrix * vec4( instPos, 1.0 );\n    gl_Position = projectionMatrix * mvPosition;\n    vViewPosition = -mvPosition.xyz;\n#if MAX_SPOT_LIGHTS > 0 || NUM_CUTPLANES > 0\n    vec4 worldPosition = modelMatrix * vec4( instPos, 1.0 );\n    vWorldPosition = worldPosition.xyz;\n#endif\n#if !defined(USE_MAP) && (MAX_DIR_LIGHTS > 0 || MAX_POINT_LIGHTS > 0 || MAX_SPOT_LIGHTS > 0) || defined ( PRISMWOODBUMP )\n    vec3 Tu, Tv;\n#if defined(PRISMWOODBUMP)\n    ComputeTangents(vtNormal, Tu, Tv);\n#else\n    ComputeTangents(vNormal, Tu, Tv);\n#endif\n    vTangent = Tu;\n    vBitangent = Tv;\n#endif\n#ifdef USE_LOGDEPTHBUF\n    if (projectionMatrix[3][3] == 0.0) {\n        gl_Position.z = log2(max(1.0e-6, gl_Position.w + 1.0)) * logDepthBufFC;\n#ifdef USE_LOGDEPTHBUF_EXT\n        vFragDepth = 1.0 + gl_Position.w;\n#else\n        gl_Position.z = (gl_Position.z - 1.0) * gl_Position.w;\n#endif\n    } else {\n#ifdef USE_LOGDEPTHBUF_EXT\n        vFragDepth = 1.0 + vViewPosition.z;\n#else\n#endif\n    }\n#endif\n#ifdef MRT_NORMALS\n    depth = mvPosition.z;\n#endif\n#include<id_vert>\n#include<shadowmap_vert>\n}\n"
    },
    function(a, b) {
        a.exports = "\n#define PI 3.141592654\n#define RECIPROCAL_PI 0.318309886\n#define RECIPROCAL_2PI 0.159154943\n#define ONE 0.00390625\nuniform vec3 surface_albedo;\nuniform float surface_roughness;\nuniform float surface_anisotropy;\nuniform float surface_rotation;\nuniform sampler2D importantSamplingRandomMap;\nuniform sampler2D importantSamplingSolidAngleMap;\n#if defined( PRISMOPAQUE )\nuniform vec3 opaque_albedo;\nuniform float opaque_f0;\nuniform vec3 opaque_luminance_modifier;\nuniform float opaque_luminance;\n#elif defined( PRISMMETAL )\nuniform vec3 metal_f0;\n#elif defined( PRISMLAYERED )\nuniform float layered_f0;\nuniform vec3 layered_diffuse;\nuniform float layered_fraction;\nuniform vec3 layered_bottom_f0;\nuniform float layered_roughness;\nuniform float layered_anisotropy;\nuniform float layered_rotation;\n#elif defined( PRISMTRANSPARENT )\nuniform float transparent_ior;\nuniform vec3 transparent_color;\nuniform float transparent_distance;\n#elif defined( PRISMWOOD )\nuniform bool wood_fiber_cosine_enable;\nuniform int wood_fiber_cosine_bands;\nuniform vec4 wood_fiber_cosine_weights;\nuniform vec4 wood_fiber_cosine_frequencies;\nuniform bool wood_fiber_perlin_enable;\nuniform int wood_fiber_perlin_bands;\nuniform vec4 wood_fiber_perlin_weights;\nuniform vec4 wood_fiber_perlin_frequencies;\nuniform float wood_fiber_perlin_scale_z;\nuniform bool wood_growth_perlin_enable;\nuniform int wood_growth_perlin_bands;\nuniform vec4 wood_growth_perlin_weights;\nuniform vec4 wood_growth_perlin_frequencies;\nuniform float wood_latewood_ratio;\nuniform float wood_earlywood_sharpness;\nuniform float wood_latewood_sharpness;\nuniform float wood_ring_thickness;\nuniform bool wood_earlycolor_perlin_enable;\nuniform int wood_earlycolor_perlin_bands;\nuniform vec4 wood_earlycolor_perlin_weights;\nuniform vec4 wood_earlycolor_perlin_frequencies;\nuniform vec3 wood_early_color;\nuniform bool wood_use_manual_late_color;\nuniform vec3 wood_manual_late_color;\nuniform bool wood_latecolor_perlin_enable;\nuniform int wood_latecolor_perlin_bands;\nuniform vec4 wood_latecolor_perlin_weights;\nuniform vec4 wood_latecolor_perlin_frequencies;\nuniform float wood_late_color_power;\nuniform bool wood_diffuse_perlin_enable;\nuniform int wood_diffuse_perlin_bands;\nuniform vec4 wood_diffuse_perlin_weights;\nuniform vec4 wood_diffuse_perlin_frequencies;\nuniform float wood_diffuse_perlin_scale_z;\nuniform bool wood_use_pores;\nuniform int wood_pore_type;\nuniform float wood_pore_radius;\nuniform float wood_pore_cell_dim;\nuniform float wood_pore_color_power;\nuniform float wood_pore_depth;\nuniform bool wood_use_rays;\nuniform float wood_ray_color_power;\nuniform float wood_ray_seg_length_z;\nuniform float wood_ray_num_slices;\nuniform float wood_ray_ellipse_z2x;\nuniform float wood_ray_ellipse_radius_x;\nuniform bool wood_use_latewood_bump;\nuniform float wood_latewood_bump_depth;\nuniform bool wood_use_groove_roughness;\nuniform float wood_groove_roughness;\nuniform float wood_diffuse_lobe_weight;\nuniform sampler2D permutationMap;\nuniform sampler2D gradientMap;\nuniform sampler2D perm2DMap;\nuniform sampler2D permGradMap;\nuniform vec4 wood_ring_fraction;\nuniform vec2 wood_fall_rise;\n#endif\nuniform float envExponentMin;\nuniform float envExponentMax;\nuniform float envExponentCount;\n#include<env_sample>\n#if TONEMAP_OUTPUT > 0\nuniform float exposureBias;\n#include<tonemap>\n#endif\n#if MAX_SPOT_LIGHTS > 0 || NUM_CUTPLANES > 0\nvarying vec3 vWorldPosition;\n#endif\n#ifdef USE_LOGDEPTHBUF\nuniform float logDepthBufFC;\n#ifdef USE_LOGDEPTHBUF_EXT\n#extension GL_EXT_frag_depth : enable\nvarying highp float vFragDepth;\n#endif\n#endif\n#include<id_decl_frag>\n#include<theming_decl_frag>\n#include<shadowmap_decl_frag>\n#ifdef USE_FOG\nuniform vec3 fogColor;\nuniform float fogNear;\nuniform float fogFar;\n#endif\n#prism_check<USE_MAP>\n#ifdef USE_MAP\nvarying vec2 vUv;\n#endif\n#if defined(PRISMWOOD) && !defined(NO_UVW)\nvarying vec3 vUvw;\n#endif\n#prism_uniforms<surface_albedo_map>\n#prism_uniforms<surface_roughness_map>\n#prism_uniforms<surface_cutout_map>\n#prism_uniforms<surface_anisotropy_map>\n#prism_uniforms<surface_rotation_map>\n#prism_uniforms<opaque_albedo_map>\n#prism_uniforms<opaque_f0_map>\n#prism_uniforms<opaque_luminance_modifier_map>\n#prism_uniforms<layered_bottom_f0_map>\n#prism_uniforms<layered_f0_map>\n#prism_uniforms<layered_diffuse_map>\n#prism_uniforms<layered_fraction_map>\n#prism_uniforms<layered_roughness_map>\n#prism_uniforms<layered_anisotropy_map>\n#prism_uniforms<layered_rotation_map>\n#prism_uniforms<metal_f0_map>\n#prism_uniforms<wood_curly_distortion_map>\n#if defined( USE_WOOD_CURLY_DISTORTION_MAP )\nuniform bool wood_curly_distortion_enable;\nuniform float wood_curly_distortion_scale;\n#endif\n#prism_bump_uniforms<surface_normal_map>\n#prism_bump_uniforms<layered_normal_map>\nfloat SRGBToLinearComponent(float color) {\n    float result = color;\n    if (result<=0.04045)\n        result *= 0.07739938;\n    else\n        result = pow(abs((result+0.055)*0.947867298), 2.4);\n    return result;\n}\nvec3 SRGBToLinear(vec3 color) {\n    vec3 result = color;\n    result.x = SRGBToLinearComponent(result.x);\n    result.y = SRGBToLinearComponent(result.y);\n    result.z = SRGBToLinearComponent(result.z);\n    return result;\n}\n#if defined( USE_ENVMAP )\nuniform float envMapExposure;\nuniform samplerCube envMap;\n#endif\n#include<float3_average>\n#if defined( USE_SURFACE_NORMAL_MAP ) || defined( USE_LAYERED_NORMAL_MAP )\nvec3 heightMapTransform(sampler2D bumpTexture, vec2 uv, mat3 transform, vec2 bumpScale, vec3 T, vec3 B, vec3 N) {\n    vec2 st = (transform * vec3(uv, 1.0)).xy; \n    mat3 mtxTangent = mat3(T, B, N); \n    T = normalize(mtxTangent * (transform * vec3(1.0, 0.0, 0.0)));\n    B = normalize(mtxTangent * (transform * vec3(0.0, 1.0, 0.0)));\n    const float oneThird = 1.0 / 3.0;\n    vec3 avg = vec3(oneThird, oneThird, oneThird);\n    vec2 offset = fwidth(st);\n    float h0 = dot(texture2D(bumpTexture, st).xyz, avg);\n    float hx = dot(texture2D(bumpTexture, st + vec2(offset.x, 0.0)).xyz, avg);\n    float hy = dot(texture2D(bumpTexture, st + vec2(0.0, offset.y)).xyz, avg);\n    vec2 diff = vec2(h0 - hx, h0 - hy) / offset;\n    return normalize(N + (diff.x * T * bumpScale.x + diff.y * B * bumpScale.y));\n}\nvec3 normalMapTransform(sampler2D bumpTexture, vec2 uv, mat3 transform, vec2 bumpScale, vec3 T, vec3 B, vec3 N) {\n    vec2 st = (transform * vec3(uv, 1.0)).xy; \n    vec3 NMap =  2.0 * texture2D( bumpTexture, st ).xyz - 1.0;  \n    return normalize(bumpScale.x * (NMap.x * T + NMap.y * B) + NMap.z * N);\n}\n#endif\n#if !defined(USE_MAP) && (MAX_DIR_LIGHTS > 0 || MAX_POINT_LIGHTS > 0 || MAX_SPOT_LIGHTS > 0) || defined ( PRISMWOODBUMP )\nvarying vec3 vTangent;\nvarying vec3 vBitangent;\n#if defined( PRISMWOODBUMP )\nvarying vec3 vtNormal;\nvarying mat3 mNormalMatrix;\n#endif\n#endif\n#if defined( USE_ENVMAP )\nvec3 sampleReflection(vec3 N, vec3 V, float mipIndex) {\n    vec3 dir = (2.0 * dot(V, N)) * N - V;\n    dir = adjustLookupVector(mat3(viewMatrixInverse) * dir);\n#ifdef ENV_GAMMA\n#ifdef HAVE_TEXTURE_LOD\n    vec4 envTexColor = textureCubeLodEXT( envMap, dir, mipIndex );\n#else\n    vec4 envTexColor = textureCube( envMap, dir, mipIndex );\n#endif\n    return GammaDecode(envTexColor, envMapExposure);\n#elif defined(ENV_RGBM)\n#ifdef HAVE_TEXTURE_LOD\n    vec4 envTexColor = textureCubeLodEXT( envMap, dir, mipIndex );\n#else\n    vec4 envTexColor = textureCube( envMap, dir, mipIndex );\n#endif\n    return RGBMDecode(envTexColor, envMapExposure);\n#else\n    vec4 envTexColor = textureCube( envMap, dir );\n    vec3 cubeColor = envTexColor.xyz;\n#ifdef GAMMA_INPUT\n    cubeColor *= cubeColor;\n#endif\n    return cubeColor;\n#endif\n}\n#endif\n#include<hatch_pattern>\n#if defined( USE_ENVMAP ) && defined( USE_IRRADIANCEMAP )\nuniform samplerCube irradianceMap;\nvec3 sampleNormal(vec3 normal) {\n    vec3 worldNormal = mat3(viewMatrixInverse) * normal;\n    vec3 irradiance = sampleIrradianceMap(worldNormal, irradianceMap, envMapExposure);\n    irradiance = applyEnvShadow(irradiance, worldNormal);\n    return irradiance;\n}\n#endif\n#if MAX_DIR_LIGHTS > 0\nuniform vec3 directionalLightColor[ MAX_DIR_LIGHTS ];\nuniform vec3 directionalLightDirection[ MAX_DIR_LIGHTS ];\n#endif\n#if MAX_POINT_LIGHTS > 0\nuniform vec3 pointLightColor[ MAX_POINT_LIGHTS ];\nuniform vec3 pointLightPosition[ MAX_POINT_LIGHTS ];\nuniform float pointLightDistance[ MAX_POINT_LIGHTS ];\n#endif\n#if MAX_SPOT_LIGHTS > 0\nuniform vec3 spotLightColor[ MAX_SPOT_LIGHTS ];\nuniform vec3 spotLightPosition[ MAX_SPOT_LIGHTS ];\nuniform vec3 spotLightDirection[ MAX_SPOT_LIGHTS ];\nuniform float spotLightAngleCos[ MAX_SPOT_LIGHTS ];\nuniform float spotLightExponent[ MAX_SPOT_LIGHTS ];\nuniform float spotLightDistance[ MAX_SPOT_LIGHTS ];\n#endif\nfloat sqr(float x) {return x*x;}\nfloat aSqrd(float maxAlphaSqr, float cosTheta)\n{\n    if (abs(cosTheta) < 1e-10)\n    {\n        return 1e10;\n    }\n    float tan2 = 1.0/sqr(cosTheta) - 1.0;\n    return maxAlphaSqr * tan2;\n}\nvec3 Fresnel_Schlick(vec3 f0, float cosAngle)\n{\n    float x = 1.0 - cosAngle;\n    float x2 = x * x;\n    float x5 = x * x2 * x2;\n    return f0 + (1.0 - f0) * x5;\n}\nvec3 Fresnel_Rough(vec3 f0, float cosAngle, float alpha)\n{\n    float x = 1.0 - cosAngle;\n    float x2 = x * x;\n    float x5 = x * x2 * x2;\n    vec3 maxReflectance = mix(vec3(1.0), f0, vec3(min(0.7, alpha)) / 0.7);\n    return f0 + (maxReflectance - f0) * x5;\n}\nfloat IORToReflectance(float ior)\n{\n    return sqr((1.0 - ior)/(1.0 + ior));\n}\nvec2 RoughnessToAlpha(float roughness, float anisotropy)\n{\n    vec2 alpha = roughness * vec2(1.0, 1.0 - anisotropy);\n    alpha = alpha * alpha;\n    alpha = clamp(alpha, 0.001, 1.0);\n    return alpha;\n}\nfloat AlphaToPhong(float alpha)\n{\n    return max(0.0, 2.56/alpha - 7.0);\n}\nfloat ExponentToReflMipIndex(float exponent)\n{\n    float targetLog = log2(exponent);\n    float minLog = log2(envExponentMin); \n    float maxLog = log2(envExponentMax); \n    float deltaLog = clamp(targetLog - minLog, 0.0, maxLog - minLog);  \n    float level = clamp((1.0-(deltaLog + 0.5) / envExponentCount), 0.0, 1.0) * 6.0; \n    return level; \n}\n#include<prism_wood>\n#if defined( ENABLEIMPORTANTSAMPLING ) && (defined( USE_SURFACE_ROTATION_MAP ) || defined( USE_SURFACE_ANISOTROPY_MAP ) || defined( USE_LAYERED_ROTATION_MAP ) || defined( USE_LAYERED_ANISOTROPY_MAP ))\n#define IMPORTANTSAMPLING\n#endif\n#if defined( IMPORTANTSAMPLING )\n#define SAMPLECOUNT 32\nvec2 Hammersley(int index)\n{\n    float u = (float(index) + 0.5) / 32.0;\n    float v = 0.5;\n    float noise = texture2D(importantSamplingRandomMap, vec2(u, v), 0.0).r;\n   return vec2(2.0 * PI * float(index/SAMPLECOUNT), noise);\n}\nvec3 ImportanceSampleAnisotropicGGX(int index, vec2 alpha, vec3 N, vec3 Tu, vec3 Tv)\n{\n    vec2 uniformSample2D = Hammersley(index);\n    float coef = sqrt(uniformSample2D.y / (1.0 - uniformSample2D.y));\n    float sinSigma, cosSigma;\n    sinSigma = sin(uniformSample2D.x);\n    cosSigma = cos(uniformSample2D.x);\n    vec3 H = coef * ((alpha.x * cosSigma) * Tu + (alpha.y * sinSigma) * Tv) + N;\n    H = normalize(H);\n    return H;\n}\nfloat ComputePDF(vec2 alpha, float NdotH, float HdotTu, float HdotTv, float VdotH)\n{\n    float factor1 = HdotTu / alpha.x;\n    float factor2 = HdotTv / alpha.y;\n    float factor3 = factor1 * factor1 + factor2 * factor2 + NdotH * NdotH;\n    float factor = factor3 * factor3 * alpha.x * alpha.y * VdotH * 4.0 * PI;\n    if (factor > 0.0)\n    {\n        return (NdotH / factor);\n    }\n    else\n    {\n        return 0.0;\n    }\n}\n#define INVFACESIZE 0.0078125\nfloat DirectionToSolidAngle(vec3 dir)\n{\n    dir = abs(dir);\n    float first = min(dir.x, dir.y);\n    float temp = max(dir.x, dir.y);\n    float second = min(temp, dir.z);\n    float third = max(temp, dir.z);\n    first /= third;\n    second /= third;\n    float u = (first+1.0)/2.0;\n    float v = (second + 1.0) / 2.0;\n    float solidAngle = texture2D(importantSamplingSolidAngleMap, vec2(u, v), 0.0).r * 0.000255;\n    return solidAngle;\n}\nfloat Smith_GGX(float value)\n{\n    return 2.0 / (1.0 + sqrt(1.0 + value));\n}\nvec2 RoughnessAnisotropyToAlpha(float roughness, float anisotropy)\n{\n    float aspect = sqrt(1.0 - 0.9 * anisotropy);\n    vec2 alpha = vec2(roughness * roughness / aspect, roughness * roughness * aspect);\n    return alpha;\n}\nvec3 ImportanceSamplingSpecular(float angle, vec3 reflectance, float roughness, float anisotropy, vec3 V, vec3 N, vec3 Tu, vec3 Tv)\n{\n    vec3 specular = vec3(0.0);\n    float radAngle;\n    if (anisotropy < 1e-10)\n    {\n        radAngle = 0.0;\n    }\n    else\n    {\n        radAngle = -PI * angle;\n    }\n    vec2 alpha = RoughnessAnisotropyToAlpha(roughness, anisotropy);\n    float alpha2 = max(alpha.x * alpha.x, alpha.y * alpha.y);\n    float NdotV = dot(N, V);\n    float alpha2NV = aSqrd(alpha2, NdotV);\n    vec2 sincosTheta;\n    sincosTheta.x = sin(radAngle);\n    sincosTheta.y = cos(radAngle);\n    vec3 Tu1, Tv1;\n    Tu1 = sincosTheta.y * Tu - sincosTheta.x * Tv;\n    Tv1 = sincosTheta.x * Tu + sincosTheta.y * Tv;\n    vec3 H;\n    vec3 sampleLightIntensity;\n    vec3 L;\n    float effectiveSample = 0.0;\n    for (int i = 0; i < SAMPLECOUNT; i++)\n    {\n        H = ImportanceSampleAnisotropicGGX(i, alpha, N, Tu1, Tv1);\n        float VdotH = dot(V, H);\n        L = 2.0 * VdotH * H - V;\n        float NdotH = dot(N, H);\n        float NdotL = dot(N, L);\n        if (NdotL >= 0.0 && NdotV > 0.0 && NdotH > 0.0)\n        {\n            float alpha2NL = aSqrd(alpha2, NdotL);\n            float HdotTu = dot(H, Tu1);\n            float HdotTv = dot(H, Tv1);\n            float pdf = ComputePDF(alpha, NdotH, HdotTu, HdotTv, VdotH);\n            float mipmapLevel = 0.0;\n            if (pdf > 0.0)\n            {\n                mipmapLevel = 0.3 * log2(1.0 / (float(SAMPLECOUNT) * pdf * DirectionToSolidAngle(L)));\n            }\n            mipmapLevel = clamp(mipmapLevel, 0.0, 4.0);\n            L = normalize(L);\n            sampleLightIntensity = sampleReflection(L, L, mipmapLevel).rgb;\n            float G = Smith_GGX(alpha2NL) * Smith_GGX(alpha2NV);\n            vec3 F = Fresnel_Schlick(reflectance, VdotH);\n            float factor = G * VdotH / (NdotH * NdotV);\n            if (factor >= 0.0)\n            {\n                specular += abs(sampleLightIntensity * F * factor);\n                effectiveSample += 1.0;\n            }\n        }\n    }\n    if (effectiveSample > 0.0)\n    {\n        specular /= effectiveSample;\n    }\n    return specular;\n}\n#endif\n#if MAX_DIR_LIGHTS > 0 || MAX_POINT_LIGHTS > 0 || MAX_SPOT_LIGHTS > 0\nvec3 DiffuseLobe(vec3 diffuseColor)\n{\n    return diffuseColor * RECIPROCAL_PI;\n}\nvec3 Rotate(vec3 vec, float angle)\n{\n    float s = sin(angle);\n    float c = cos(angle);\n    return vec3(vec.x * c - vec.y * s, vec.x * s + vec.y * c, vec.z);\n}\nfloat NDF_GGX(float alphaU, float alphaV, vec3 normal)\n{\n    float nx2 = sqr(normal.x);\n    float ny2 = sqr(normal.y);\n    float nz2 = sqr(normal.z);\n    float scale = 1.0/(alphaU * alphaV * PI);\n    return scale/sqr(nx2/sqr(alphaU) + ny2/sqr(alphaV) + nz2);\n}\nfloat G1_GGX(float aSqrd)\n{\n    return 2.0 / (1.0 + sqrt(1.0 + aSqrd));\n}\nvec3 MicrofacetLobe(\n        vec3 Hlocal, float NdotL, float NdotH, float NdotV, float VdotH,\n        float roughness, float anisotropy, float rotation, vec3 reflectance)\n{\n    vec2 alpha = RoughnessToAlpha(roughness, anisotropy);\n    Hlocal = Rotate(Hlocal, rotation);\n    vec3 F = Fresnel_Schlick(reflectance, VdotH);\n    float D = NDF_GGX(alpha.x, alpha.y, Hlocal);\n    float alpha2 = max(sqr(alpha.x), sqr(alpha.y));\n    float alpha2NL = aSqrd(alpha2, NdotL);\n    float alpha2NV = aSqrd(alpha2, NdotV);\n    float G = G1_GGX(alpha2NL) * G1_GGX(alpha2NV);\n    return max(F * D * G / (4.0 * NdotL * NdotV), vec3(0.0));\n}\n#if defined( PRISMOPAQUE )\nvec3 BRDF_Opaque(vec3 Hlocal, float NdotL, float NdotH, float NdotV, float VdotH, \n        vec3 surfaceAlbedo, float surfaceRoughness, float surfaceAnisotropy, float surfaceRotation, \n        float opaqueF0, vec3 opaqueAlbedo)\n{\n    vec3 diffuse = DiffuseLobe(opaqueAlbedo);\n    vec3 specular = surfaceAlbedo * MicrofacetLobe(\n            Hlocal, NdotL, NdotH, NdotV, VdotH,\n            surfaceRoughness, surfaceAnisotropy, surfaceRotation, vec3(opaqueF0));\n    return (specular+diffuse)*NdotL;\n}\n#elif defined( PRISMMETAL )\nvec3 BRDF_Metal(vec3 Hlocal, float NdotL, float NdotH, float NdotV, float VdotH, \n        vec3 surfaceAlbedo, float surfaceRoughness, float surfaceAnisotropy, float surfaceRotation, \n        vec3 metalF0)\n{\n    vec3 specular = surfaceAlbedo * MicrofacetLobe(\n            Hlocal, NdotL, NdotH, NdotV, VdotH,\n            surfaceRoughness, surfaceAnisotropy, surfaceRotation, metalF0);\n    return specular*NdotL;\n}\n#elif defined( PRISMLAYERED )\nvec3 BRDF_Layered(vec3 Hlocal, float NdotL, float NdotH, float NdotV, float VdotH, \n        vec3 Hlocal2, float N2dotL, float N2dotH, float N2dotV, \n        vec3 surfaceAlbedo, float surfaceRoughness, float surfaceAnisotropy, float surfaceRotation,\n        float layeredF0, vec3 layeredDiffuse, float layeredRoughness, float layeredAnisotropy,\n        float layeredRotation, vec3 bottom_f0, float layeredFraction)\n{\n    vec3 Fl = Fresnel_Schlick(vec3(layeredF0), NdotL);\n    vec3 Fv = Fresnel_Schlick(vec3(layeredF0), NdotV);\n    vec3 amount = (1.0 - Fl) * (1.0 - Fv);\n    vec3 topSpecular = surfaceAlbedo * MicrofacetLobe(\n            Hlocal, NdotL, NdotH, NdotV, VdotH,\n            surfaceRoughness, surfaceAnisotropy, surfaceRotation,\n            vec3(layeredF0));\n    vec3 topDiffuse = DiffuseLobe(layeredDiffuse);\n    vec3 botSpecular = MicrofacetLobe(\n            Hlocal2, N2dotL, N2dotH, N2dotV, VdotH,\n            layeredRoughness, layeredAnisotropy, layeredRotation,\n            bottom_f0);\n    return topSpecular*NdotL + amount * mix(topDiffuse*NdotL, botSpecular*N2dotL, layeredFraction);\n}\n#elif defined( PRISMTRANSPARENT )\nvec3 BRDF_Transparent(vec3 Hlocal, float NdotL, float NdotH, float NdotV, float VdotH, \n        vec3 surfaceAlbedo, float surfaceRoughness, float surfaceAnisotropy, float surfaceRotation)\n{\n    vec3 reflectance = vec3(IORToReflectance(transparent_ior));\n    vec3 specular = surfaceAlbedo * MicrofacetLobe(\n            Hlocal, NdotL, NdotH, NdotV, VdotH,\n            surfaceRoughness, surfaceAnisotropy, surfaceRotation, reflectance);\n    return specular*NdotL;\n}\n#elif defined( PRISMWOOD )\nvec3 BRDF_Wood(vec3 Hlocal, float NdotL, float NdotH, float NdotV, float VdotH, \n        vec3 surfaceAlbedo, float surfaceRoughness, vec3 woodDiffuse)\n{\n    vec3 diffuse = DiffuseLobe(woodDiffuse);\n    vec3 specular = surfaceAlbedo * MicrofacetLobe(\n            Hlocal, NdotL, NdotH, NdotV, VdotH,\n            surfaceRoughness, 0.0, 0.0, vec3(0.04));\n    return (specular+diffuse)*NdotL;\n}\n#endif\n#endif\n#if defined( USE_ENVMAP )\n#if defined( PRISMOPAQUE )\nvec3 Environment_Opaque(vec3 N, vec3 V, float NdotV, vec3 surfaceAlbedo, float surfaceRoughness,\n        float opaqueF0, vec3 opaqueAlbedo, float surfaceAnisotropy, float surfaceRotation, vec3 Tu, vec3 T)\n{\n    float alpha = RoughnessToAlpha(surfaceRoughness, 0.0).x;\n    vec3 F = Fresnel_Rough(vec3(opaqueF0), NdotV, alpha);\n#if defined( IMPORTANTSAMPLING )\n    vec3 specular = surfaceAlbedo * ImportanceSamplingSpecular(surfaceRotation, vec3(opaqueF0), surfaceRoughness, surfaceAnisotropy, V, N, Tu, Tv);\n#else\n    float exponent = AlphaToPhong(alpha);\n    float reflMipIndex = ExponentToReflMipIndex(exponent);\n    vec3 envSpecular = sampleReflection(N, V, reflMipIndex);\n    vec3 specular = F* surfaceAlbedo * envSpecular;\n#endif\n    \n#if defined( USE_IRRADIANCEMAP )\n    vec3 envIrradiance = sampleNormal(N);\n#else\n    vec3 envIrradiance = vec3(1.0);\n#endif\n    vec3 diffuse = (1.0 - F) * opaqueAlbedo * envIrradiance;\n    vec3 luminanceModifier;\n#prism_sample_texture<opaque_luminance_modifier, luminanceModifier, false, true>\n    vec3 emission = luminanceModifier * opaque_luminance;\n    return diffuse + specular + emission;\n}\n#elif defined( PRISMMETAL )\nvec3 Environment_Metal(vec3 N, vec3 V, float NdotV, vec3 surfaceAlbedo, float surfaceRoughness, vec3 metalF0, float surfaceAnisotropy, float surfaceRotation, vec3 Tu, vec3 Tv)\n{\n#if defined( IMPORTANTSAMPLING )\n    vec3 specular = surfaceAlbedo * ImportanceSamplingSpecular(surfaceRotation, metalF0, surfaceRoughness, surfaceAnisotropy, V, N, Tu, Tv);\n#else\n    float alpha = RoughnessToAlpha(surfaceRoughness, 0.0).x;\n    float exponent = AlphaToPhong(alpha);\n    float reflMipIndex = ExponentToReflMipIndex(exponent);\n    vec3 F = Fresnel_Rough(metalF0, NdotV, alpha);\n    vec3 envSpecular = sampleReflection(N, V, reflMipIndex);\n    vec3 specular = F * surfaceAlbedo * envSpecular;\n#endif\n    return specular;\n}\n#elif defined( PRISMLAYERED )\nvec3 Environment_Layered(vec3 N, vec3 V, float NdotV, vec3 N2, float N2dotV, vec3 surfaceAlbedo, float surfaceRoughness,\n        float layeredF0, float surfaceAnisotropy, float surfaceRotation, vec3 Tu, vec3 Tv, vec3 layeredDiffuse, float layeredRoughness, \n        float layeredAnisotropy, float layeredRotation, vec3 bottom_f0, float layeredFraction)\n{\n    vec3 F = Fresnel_Schlick(vec3(layeredF0), NdotV);\n    float alpha = RoughnessToAlpha(surfaceRoughness, 0.0).x;\n#if defined( IMPORTANTSAMPLING )\n    vec3 topSpecular = surfaceAlbedo * ImportanceSamplingSpecular(surfaceRotation, vec3(layeredF0), surfaceRoughness, surfaceAnisotropy, V, N, Tu, Tv);\n#else\n    float exponent = AlphaToPhong(alpha);\n    float reflMipIndex = ExponentToReflMipIndex(exponent);\n    vec3 envSpecular = sampleReflection(N, V, reflMipIndex);\n    vec3 topSpecular = F * surfaceAlbedo * envSpecular;\n#endif\n    vec3 amount = (1.0 - F);\n#if defined( USE_IRRADIANCEMAP )\n    vec3 envIrradiance = sampleNormal(N);\n#else\n    vec3 envIrradiance = vec3(1.0);\n#endif\n    vec3 topDiffuse = layeredDiffuse * envIrradiance;\n#if defined( IMPORTANTSAMPLING )\n    vec3 botSpecular = ImportanceSamplingSpecular(layeredRotation, bottom_f0, layeredRoughness, layeredAnisotropy, V, N2, Tu, Tv);\n#else\n    alpha = RoughnessToAlpha(layeredRoughness, 0.0).x;\n    exponent = AlphaToPhong(alpha);\n    reflMipIndex = ExponentToReflMipIndex(exponent);\n    envSpecular = sampleReflection(N2, V, reflMipIndex);\n    F = Fresnel_Rough(bottom_f0, N2dotV, alpha);\n    vec3 botSpecular = F * envSpecular;\n#endif\n    return topSpecular + amount * mix(topDiffuse, botSpecular, layeredFraction);\n}\n#elif defined( PRISMTRANSPARENT )\nvec3 Environment_Transparent(vec3 N, vec3 V, float NdotV, vec3 surfaceAlbedo, float surfaceRoughness, float surfaceAnisotropy, float surfaceRotation, vec3 Tu, vec3 Tv)\n{\n    vec3 reflectance = vec3(IORToReflectance(transparent_ior));\n    float alpha = RoughnessToAlpha(surfaceRoughness, 0.0).x;\n    vec3 F = Fresnel_Rough(reflectance, NdotV, alpha);\n#if defined( IMPORTANTSAMPLING )\n    vec3 specular = surfaceAlbedo * ImportanceSamplingSpecular(surfaceRotation, reflectance, surfaceRoughness, surfaceAnisotropy, V, N, Tu, Tv);\n#else\n    float exponent = AlphaToPhong(alpha);\n    float reflMipIndex = ExponentToReflMipIndex(exponent);\n    vec3 envSpecular = sampleReflection(N, V, reflMipIndex);\n    vec3 specular = F * surfaceAlbedo * envSpecular;\n#endif\n#if defined( USE_IRRADIANCEMAP )\n    vec3 envIrradiance = sampleNormal(N);\n#else\n    vec3 envIrradiance = vec3(1.0);\n#endif\n    vec3 color = F * surfaceRoughness * transparent_color * envIrradiance;\n    return specular + color;\n}\n#elif defined( PRISMWOOD )\nvec3 Environment_Wood(vec3 N, vec3 V, float NdotV, vec3 surfaceAlbedo, float surfaceRoughness, vec3 woodDiffuse, float surfaceAnisotropy, float surfaceRotation, vec3 Tu, vec3 Tv)\n{\n    float alpha = RoughnessToAlpha(surfaceRoughness, 0.0).x;\n    vec3 F = Fresnel_Rough(vec3(0.04), NdotV, alpha);\n#if defined( IMPORTANTSAMPLING )\n    vec3 specular = surfaceAlbedo * ImportanceSamplingSpecular(surfaceRotation, vec3(0.04), surfaceRoughness, surfaceAnisotropy, V, N, Tu, Tv);\n#else\n    float exponent = AlphaToPhong(alpha);\n    float reflMipIndex = ExponentToReflMipIndex(exponent);\n    vec3 envSpecular = sampleReflection(N, V, reflMipIndex);\n    vec3 specular = F * surfaceAlbedo * envSpecular;\n#endif\n#if defined( USE_IRRADIANCEMAP )\n    vec3 envIrradiance = sampleNormal(N);\n#else\n    vec3 envIrradiance = vec3(1.0);\n#endif\n    vec3 diffuse = (1.0 - F) * woodDiffuse * envIrradiance;\n    return diffuse + specular;\n}\n#endif\n#endif\nvarying vec3 vNormal;\nvarying vec3 vViewPosition;\n#include<cutplanes>\nvoid main() {\n#if NUM_CUTPLANES > 0\n    checkCutPlanes(vWorldPosition);\n#endif\n    vec3 N = normalize(vNormal);\n    vec3 Tu = vec3(0.0);\n    vec3 Tv = vec3(0.0);\n#if defined( USE_SURFACE_NORMAL_MAP ) || defined( USE_LAYERED_NORMAL_MAP ) || MAX_DIR_LIGHTS > 0 || MAX_POINT_LIGHTS > 0 || MAX_SPOT_LIGHTS > 0 || defined( PRISMWOODBUMP ) || defined( IMPORTANTSAMPLING )\n#if !defined(USE_MAP) || defined( PRISMWOODBUMP )\n    Tu = normalize(vTangent);\n    Tv = normalize(vBitangent);\n#else\n    vec3 q0 = dFdx( -vViewPosition );\n    vec3 q1 = dFdy( -vViewPosition );\n    vec2 st0 = dFdx( vUv );\n    vec2 st1 = dFdy( vUv );\n    Tu = normalize(  q0 * st1.t - q1 * st0.t );\n    Tv = normalize( -q0 * st1.s + q1 * st0.s );\n#endif\n#endif\n    vec3 V;\n    if (projectionMatrix[3][3] == 0.0) {\n        V = normalize( vViewPosition );\n    } else {\n        V = vec3(0.0, 0.0, 1.0);\n    }\n    N = faceforward(N, -V, N);\n#if defined(PRISMLAYERED)\n    vec3 N2 = N;\n#endif\n#ifndef FLAT_SHADED\n    vec3 normal = normalize( vNormal );\n#ifdef DOUBLE_SIDED\n    normal = normal * ( -1.0 + 2.0 * float( gl_FrontFacing ) );\n#endif\n#else\n    vec3 fdx = dFdx( vViewPosition );\n    vec3 fdy = dFdy( vViewPosition );\n    vec3 normal = normalize( cross( fdx, fdy ) );\n#endif\n    vec3 geomNormal = normal;\n#if defined( USE_SURFACE_NORMAL_MAP )\n    if (surface_normal_map_bumpmapType == 0)\n        N = heightMapTransform(surface_normal_map, vUv, surface_normal_map_texMatrix, surface_normal_map_bumpScale, Tu, Tv, N);\n    else\n        N = normalMapTransform(surface_normal_map, vUv, surface_normal_map_texMatrix, surface_normal_map_bumpScale, Tu, Tv, N);\n#endif\n#if defined( USE_LAYERED_NORMAL_MAP )\n    if (layered_normal_map_bumpmapType == 0)\n        N2 = heightMapTransform(layered_normal_map, vUv, layered_normal_map_texMatrix, layered_normal_map_bumpScale, Tu, Tv, N2);\n    else\n        N2 = normalMapTransform(layered_normal_map, vUv, layered_normal_map_texMatrix, layered_normal_map_bumpScale, Tu, Tv, N2);\n#endif\n#if defined( PRISMWOOD )\n#ifdef NO_UVW\n    vec3 p = vec3(0.0);\n#elif defined( USE_WOOD_CURLY_DISTORTION_MAP )\n    vec3 p = DistortCurly(vUvw);\n#else\n    vec3 p = vUvw;\n#endif\n#if !defined( NO_UVW ) && defined( PRISMWOODBUMP )\n    vec3 offsetTuLeft = p - 0.001 * Tu;\n    vec3 offsetTuRight = p + 0.001 * Tu;\n    vec3 offsetTvLeft = p - 0.001 * Tv;\n    vec3 offsetTvRight = p + 0.001 * Tv;\n    float heightVariationTuLeft = HeightVariation(offsetTuLeft);\n    float heightVariationTuRight = HeightVariation(offsetTuRight);\n    float heightVariationTvLeft = HeightVariation(offsetTvLeft);\n    float heightVariationTvRight = HeightVariation(offsetTvRight);\n    vec3 bumpHeight = WoodBumpHeight(heightVariationTuLeft, heightVariationTuRight, heightVariationTvLeft, heightVariationTvRight);\n    vec3 newNormal = normalize(bumpHeight.x * Tu + bumpHeight.y * Tv + bumpHeight.z * vtNormal);\n    vec3 newNormalView = normalize(mNormalMatrix * newNormal);\n    vec3 selectedNormal = SelectNormal(geomNormal, newNormalView, V);\n    ComputeTangents(selectedNormal, Tu, Tv);\n    Tu = normalize(Tu);\n    Tv = normalize(Tv);\n    N = faceforward(selectedNormal, -V, selectedNormal);\n#endif\n#endif\n    float NdotV = dot(N, V);\n#if defined(PRISMLAYERED)\n    float N2dotV = dot(N2, V);\n#endif\n    vec3 surfaceAlbedo;\n#prism_sample_texture<surface_albedo, surfaceAlbedo, false, true>\n    float surfaceRoughness;\n#prism_sample_texture<surface_roughness, surfaceRoughness, true, false>\n    float surfaceAnisotropy;\n#prism_sample_texture<surface_anisotropy, surfaceAnisotropy, true, false>\n    float surfaceRotation;\n#prism_sample_texture<surface_rotation, surfaceRotation, true, false>\n#if defined(PRISMOPAQUE)\n    float opaqueF0;\n#prism_sample_texture<opaque_f0, opaqueF0, true, false>\n    vec3 opaqueAlbedo;\n#prism_sample_texture<opaque_albedo, opaqueAlbedo, false, true>\n#elif defined(PRISMMETAL)\n    vec3 metalF0;\n#prism_sample_texture<metal_f0, metalF0, false, true>\n#elif defined(PRISMLAYERED)\n    float layeredF0;\n#prism_sample_texture<layered_f0, layeredF0, true, false>\n    vec3 layeredDiffuse;\n#prism_sample_texture<layered_diffuse, layeredDiffuse, false, true>\n    float layeredRoughness;\n#prism_sample_texture<layered_roughness, layeredRoughness, true, false>\n    float layeredAnisotropy;\n#prism_sample_texture<layered_anisotropy, layeredAnisotropy, true, false>\n    float layeredRotation;\n#prism_sample_texture<layered_rotation, layeredRotation, true, false>\n    vec3 bottom_f0;\n#prism_sample_texture<layered_bottom_f0, bottom_f0, false, true>\n    float layeredFraction;\n#prism_sample_texture<layered_fraction, layeredFraction, true, false>\n#elif defined(PRISMWOOD)\n    vec3 woodDiffuse = NoiseWood(p, surfaceRoughness);\n#endif\n    vec3 outRadianceLight = vec3(0.0);\n#if MAX_DIR_LIGHTS > 0 || MAX_POINT_LIGHTS > 0 || MAX_SPOT_LIGHTS > 0\n    vec3 lightDirection[ MAX_DIR_LIGHTS + MAX_POINT_LIGHTS + MAX_SPOT_LIGHTS ];\n    vec3 lightColor[ MAX_DIR_LIGHTS + MAX_POINT_LIGHTS + MAX_SPOT_LIGHTS ];\n#if MAX_DIR_LIGHTS > 0\n    for( int i = 0; i < MAX_DIR_LIGHTS; i ++ ) {\n        vec4 lDirection = viewMatrix * vec4( directionalLightDirection[ i ], 0.0 );\n        lightDirection[i] = normalize( lDirection.xyz );\n        lightColor[i] = SRGBToLinear(directionalLightColor[ i ]);\n    }\n#endif\n#if MAX_POINT_LIGHTS > 0\n    for( int i = 0; i < MAX_POINT_LIGHTS; i ++ ) {\n        vec4 lPosition = viewMatrix * vec4( pointLightPosition[ i ], 1.0 );\n        vec3 lVector = lPosition.xyz + vViewPosition.xyz;\n        lightDirection[MAX_DIR_LIGHTS + i] = normalize( lVector );\n        float lDistance = 1.0;\n        if ( pointLightDistance[ i ] > 0.0 )\n            lDistance = 1.0 - min( ( length( lVector ) / pointLightDistance[ i ] ), 1.0 );\n        lightColor[MAX_DIR_LIGHTS + i] = SRGBToLinear(pointLightColor[ i ]) * lDistance;\n    }\n#endif\n#if MAX_SPOT_LIGHTS > 0\n    for( int i = 0; i < MAX_SPOT_LIGHTS; i ++ ) {\n        vec4 lPosition = viewMatrix * vec4( spotLightPosition[ i ], 1.0 );\n        vec3 lVector = lPosition.xyz + vViewPosition.xyz;\n        lightDirection[MAX_DIR_LIGHTS + MAX_POINT_LIGHTS + i] = normalize( lVector );\n        float lDistance = 1.0;\n        if ( spotLightDistance[ i ] > 0.0 )\n            lDistance = 1.0 - min( ( length( lVector ) / spotLightDistance[ i ] ), 1.0 );\n        float spotEffect = dot( spotLightDirection[ i ], normalize( spotLightPosition[ i ] - vWorldPosition ) );\n        if ( spotEffect > spotLightAngleCos[ i ] )\n            spotEffect = max( pow( spotEffect, spotLightExponent[ i ] ), 0.0 );\n        lightColor[MAX_DIR_LIGHTS + MAX_POINT_LIGHTS + i] = SRGBToLinear(spotLightColor[ i ]) * lDistance * spotEffect;\n    }\n#endif\n    for( int i = 0; i < MAX_DIR_LIGHTS + MAX_POINT_LIGHTS + MAX_SPOT_LIGHTS; i ++ ) {\n        vec3 L = lightDirection[i];\n        float NdotL = max(0.0, dot(N, L));\n        vec3 H = normalize(L + V);\n        float NdotH = dot(N, H);\n        float VdotH = dot(V, H);\n        float Hu = dot(H, Tu);\n        float Hv = dot(H, Tv);\n        vec3 Hlocal = vec3(Hu, Hv, NdotH);\n#if defined(PRISMLAYERED)\n        float N2dotL = dot(N2, L);\n        float N2dotH = dot(N2, H);\n        vec3 Hlocal2 = vec3(Hu, Hv, N2dotH);\n#endif\n        vec3 brdf = lightColor[i] * \n#if defined(PRISMOPAQUE)\n            BRDF_Opaque(Hlocal, NdotL, NdotH, NdotV, VdotH,\n                    surfaceAlbedo, surfaceRoughness, surfaceAnisotropy, surfaceRotation,\n                    opaqueF0, opaqueAlbedo);\n#elif defined(PRISMMETAL)\n        BRDF_Metal(Hlocal, NdotL, NdotH, NdotV, VdotH, \n                surfaceAlbedo, surfaceRoughness, surfaceAnisotropy, surfaceRotation, \n                metalF0);\n#elif defined(PRISMLAYERED)\n        BRDF_Layered(Hlocal, NdotL, NdotH, NdotV, VdotH, Hlocal2, N2dotL, N2dotH, N2dotV,\n                surfaceAlbedo, surfaceRoughness, surfaceAnisotropy, surfaceRotation,\n                layeredF0, layeredDiffuse, layeredRoughness, layeredAnisotropy,\n                layeredRotation, bottom_f0, layeredFraction);\n#elif defined(PRISMTRANSPARENT)\n        BRDF_Transparent(Hlocal, NdotL, NdotH, NdotV, VdotH, surfaceAlbedo, surfaceRoughness, surfaceAnisotropy, surfaceRotation);\n#elif defined(PRISMWOOD)\n        BRDF_Wood(Hlocal, NdotL, NdotH, NdotV, VdotH, surfaceAlbedo, surfaceRoughness, woodDiffuse);\n#endif\n        outRadianceLight += max(vec3(0.0), brdf);\n    }\n#endif\n    float opacity = 1.0;\n    vec3 outRadianceEnv = vec3(0.0);\n#if defined( USE_ENVMAP )\n    outRadianceEnv =\n#if defined(PRISMOPAQUE)\n        Environment_Opaque(N, V, clamp(NdotV, 0.0, 1.0), surfaceAlbedo, surfaceRoughness,\n                opaqueF0, opaqueAlbedo, surfaceAnisotropy, surfaceRotation, Tu, Tv);\n#elif defined(PRISMMETAL)\n    Environment_Metal(N, V, clamp(NdotV, 0.0, 1.0), surfaceAlbedo, surfaceRoughness, metalF0, surfaceAnisotropy, surfaceRotation, Tu, Tv);\n#elif defined(PRISMLAYERED)\n    Environment_Layered(N, V, clamp(NdotV, 0.0, 1.0), N2, clamp(N2dotV, 0.0, 1.0), surfaceAlbedo, surfaceRoughness,\n            layeredF0, surfaceAnisotropy, surfaceRotation, Tu, Tv, layeredDiffuse, layeredRoughness, layeredAnisotropy,\n            layeredRotation, bottom_f0, layeredFraction);\n#elif defined(PRISMTRANSPARENT)\n    Environment_Transparent(N, V, clamp(NdotV, 0.0, 1.0), surfaceAlbedo, surfaceRoughness, surfaceAnisotropy, surfaceRotation, Tu, Tv);\n#elif defined(PRISMWOOD)\n    Environment_Wood(N, V, clamp(NdotV, 0.0, 1.0), surfaceAlbedo, surfaceRoughness, woodDiffuse, surfaceAnisotropy, surfaceRotation, Tu, Tv);\n#endif\n#endif\n    float surface_cutout = 1.0;\n#prism_sample_texture<surface_cutout, surface_cutout, true, false>\n#if defined( USE_SURFACE_CUTOUT_MAP )\n    if(surface_cutout < 0.01) discard;\n#endif\n    gl_FragColor = vec4( outRadianceLight + outRadianceEnv, opacity*surface_cutout );\n#if TONEMAP_OUTPUT == 1\n    gl_FragColor.xyz = toneMapCanonOGS_WithGamma_WithColorPerserving(exposureBias * gl_FragColor.xyz);\n#elif TONEMAP_OUTPUT == 2\n    gl_FragColor.xyz = toneMapCanonFilmic_WithGamma(exposureBias * gl_FragColor.xyz);\n#endif\n#ifdef USE_FOG\n    float depth = gl_FragCoord.z / gl_FragCoord.w;\n    float fogFactor = smoothstep( fogNear, fogFar, depth );\n    gl_FragColor = mix( gl_FragColor, vec4( fogColor, gl_FragColor.w ), fogFactor );\n#endif\n#if defined(PRISMTRANSPARENT)\n    float fsLevel = max( gl_FragColor.r, gl_FragColor.g );\n    fsLevel = max( gl_FragColor.b, fsLevel );\n    gl_FragColor = vec4( gl_FragColor.r/fsLevel, gl_FragColor.g/fsLevel, gl_FragColor.b/fsLevel, fsLevel );\n    float transLevel = min( transparent_color.r, transparent_color.g );\n    transLevel = min( transparent_color.b, transLevel );\n    transLevel = min( (1.0-surface_roughness), transLevel );\n    float transAlpha = (1.0-transLevel)*0.4 + surface_roughness*0.55;\n    vec3 tr_g_color = sqrt(transparent_color);\n    vec4 transColor = vec4( 0.5 * vec3(tr_g_color), transAlpha );\n    float strength = 1.0 - (1.0-fsLevel)*(1.0-fsLevel);\n    gl_FragColor = mix( transColor, gl_FragColor, strength );\n    if ( gl_FragColor.a < 0.05 ) {\n        gl_FragColor.a = 0.05;\n    }\n    gl_FragColor.a *= surface_cutout;\n    \n    if (transparent_ior == 1.0 && tr_g_color == vec3(1.0,1.0,1.0)) {\n        gl_FragColor.a = 0.0;\n    }\n#endif\n#include<theming_frag>\n#include<final_frag>\n}\n"
    },
    function(a, b, c) {
        "use strict";
        var d = c(71),
            e = c(95),
            f = c(96),
            g = c(82),
            h = function(a) {
                function b(a) {
                    a.__webglVertexBuffer = Qa.createBuffer(),
                        a.__webglColorBuffer = Qa.createBuffer(),
                        a.__webglLineDistanceBuffer = Qa.createBuffer(),
                        Ua.info.memory.geometries++
                }
                function c(a) {
                    a.__webglVertexBuffer = Qa.createBuffer(),
                        a.__webglColorBuffer = Qa.createBuffer(),
                        Ua.info.memory.geometries++
                }
                function h(a) {
                    a.__webglVertexBuffer = Qa.createBuffer(),
                        a.__webglNormalBuffer = Qa.createBuffer(),
                        a.__webglTangentBuffer = Qa.createBuffer(),
                        a.__webglColorBuffer = Qa.createBuffer(),
                        a.__webglUVBuffer = Qa.createBuffer(),
                        a.__webglUV2Buffer = Qa.createBuffer(),
                        a.__webglSkinIndicesBuffer = Qa.createBuffer(),
                        a.__webglSkinWeightsBuffer = Qa.createBuffer(),
                        a.__webglFaceBuffer = Qa.createBuffer(),
                        a.__webglLineBuffer = Qa.createBuffer(),
                        Ua.info.memory.geometries++
                }
                function i(a, b) {
                    var c = a.vertices.length,
                        d = b.material;
                    if (d.attributes) {
                        void 0 === a.__webglCustomAttributesList && (a.__webglCustomAttributesList = []);
                        for (var e in d.attributes) {
                            var f = d.attributes[e];
                            if (!f.__webglInitialized || f.createUniqueBuffers) {
                                f.__webglInitialized = !0;
                                var g = 1;
                                "v2" === f.type ? g = 2 : "v3" === f.type ? g = 3 : "v4" === f.type ? g = 4 : "c" === f.type && (g = 3),
                                    f.size = g,
                                    f.array = new Float32Array(c * g),
                                    f.buffer = Qa.createBuffer(),
                                    f.buffer.belongsToAttribute = e,
                                    f.needsUpdate = !0
                            }
                            a.__webglCustomAttributesList.push(f)
                        }
                    }
                }
                function j(a, b) {
                    var c = a.vertices.length;
                    a.__vertexArray = new Float32Array(3 * c),
                        a.__colorArray = new Float32Array(3 * c),
                        a.__lineDistanceArray = new Float32Array(1 * c),
                        a.__webglLineCount = c,
                        i(a, b)
                }
                function k(a, b) {
                    var c = a.vertices.length;
                    a.__vertexArray = new Float32Array(3 * c),
                        a.__colorArray = new Float32Array(3 * c),
                        a.__webglPointCount = c,
                        i(a, b)
                }
                function l(a, b) {
                    var c = b.geometry,
                        d = a.faces3,
                        e = 3 * d.length,
                        f = 1 * d.length,
                        g = 3 * d.length,
                        h = m(b, a),
                        i = q(h),
                        j = o(h),
                        k = p(h);
                    a.__vertexArray = new Float32Array(3 * e),
                    j && (a.__normalArray = new Float32Array(3 * e)),
                    c.hasTangents && (a.__tangentArray = new Float32Array(4 * e)),
                    k && (a.__colorArray = new Float32Array(3 * e)),
                    i && (c.faceVertexUvs.length > 0 && (a.__uvArray = new Float32Array(2 * e)), c.faceVertexUvs.length > 1 && (a.__uv2Array = new Float32Array(2 * e))),
                    b.geometry.skinWeights.length && b.geometry.skinIndices.length && (a.__skinIndexArray = new Float32Array(4 * e), a.__skinWeightArray = new Float32Array(4 * e));
                    var l = null !== rb.get("OES_element_index_uint") && f > 21845 ? Uint32Array: Uint16Array;
                    if (a.__typeArray = l, a.__faceArray = new l(3 * f), a.__lineArray = new l(2 * g), a.__webglFaceCount = 3 * f, a.__webglLineCount = 2 * g, h.attributes) {
                        void 0 === a.__webglCustomAttributesList && (a.__webglCustomAttributesList = []);
                        for (var n in h.attributes) {
                            var r = h.attributes[n],
                                s = {};
                            for (var t in r) s[t] = r[t];
                            if (!s.__webglInitialized || s.createUniqueBuffers) {
                                s.__webglInitialized = !0;
                                var u = 1;
                                "v2" === s.type ? u = 2 : "v3" === s.type ? u = 3 : "v4" === s.type ? u = 4 : "c" === s.type && (u = 3),
                                    s.size = u,
                                    s.array = new Float32Array(e * u),
                                    s.buffer = Qa.createBuffer(),
                                    s.buffer.belongsToAttribute = n,
                                    r.needsUpdate = !0,
                                    s.__original = r
                            }
                            a.__webglCustomAttributesList.push(s)
                        }
                    }
                    a.__inittedArrays = !0
                }
                function m(a, b) {
                    return a.material instanceof THREE.MeshFaceMaterial ? a.material.materials[b.materialIndex] : a.material
                }
                function n(a) {
                    return a && void 0 !== a.shading && a.shading === THREE.SmoothShading
                }
                function o(a) {
                    return ! (a instanceof THREE.MeshBasicMaterial && !a.envMap || a instanceof THREE.MeshDepthMaterial) && (n(a) ? THREE.SmoothShading: THREE.FlatShading)
                }
                function p(a) {
                    return !! a.vertexColors && a.vertexColors
                }
                function q(a) {
                    return !! (a.map || a.lightMap || a.bumpMap || a.normalMap || a.specularMap || a.alphaMap || a instanceof THREE.ShaderMaterial)
                }
                function r(a, b) {
                    var c, d, e, f, g, h, i, j, k, l, m, n, o = a.vertices,
                        p = a.colors,
                        q = a.lineDistances,
                        r = o.length,
                        s = p.length,
                        t = q.length,
                        u = a.__vertexArray,
                        v = a.__colorArray,
                        w = a.__lineDistanceArray,
                        x = a.verticesNeedUpdate,
                        y = a.colorsNeedUpdate,
                        z = a.lineDistancesNeedUpdate,
                        A = a.__webglCustomAttributesList;
                    if (x) {
                        for (c = 0; c < r; c++) f = o[c],
                            g = 3 * c,
                            u[g] = f.x,
                            u[g + 1] = f.y,
                            u[g + 2] = f.z;
                        Qa.bindBuffer(Qa.ARRAY_BUFFER, a.__webglVertexBuffer),
                            Qa.bufferData(Qa.ARRAY_BUFFER, u, b)
                    }
                    if (y) {
                        for (d = 0; d < s; d++) h = p[d],
                            g = 3 * d,
                            v[g] = h.r,
                            v[g + 1] = h.g,
                            v[g + 2] = h.b;
                        Qa.bindBuffer(Qa.ARRAY_BUFFER, a.__webglColorBuffer),
                            Qa.bufferData(Qa.ARRAY_BUFFER, v, b)
                    }
                    if (z) {
                        for (e = 0; e < t; e++) w[e] = q[e];
                        Qa.bindBuffer(Qa.ARRAY_BUFFER, a.__webglLineDistanceBuffer),
                            Qa.bufferData(Qa.ARRAY_BUFFER, w, b)
                    }
                    if (A) for (i = 0, j = A.length; i < j; i++) if (n = A[i], n.needsUpdate && (void 0 === n.boundTo || "vertices" === n.boundTo)) {
                        if (g = 0, l = n.value.length, 1 === n.size) for (k = 0; k < l; k++) n.array[k] = n.value[k];
                        else if (2 === n.size) for (k = 0; k < l; k++) m = n.value[k],
                            n.array[g] = m.x,
                            n.array[g + 1] = m.y,
                            g += 2;
                        else if (3 === n.size) if ("c" === n.type) for (k = 0; k < l; k++) m = n.value[k],
                            n.array[g] = m.r,
                            n.array[g + 1] = m.g,
                            n.array[g + 2] = m.b,
                            g += 3;
                        else for (k = 0; k < l; k++) m = n.value[k],
                                n.array[g] = m.x,
                                n.array[g + 1] = m.y,
                                n.array[g + 2] = m.z,
                                g += 3;
                        else if (4 === n.size) for (k = 0; k < l; k++) m = n.value[k],
                            n.array[g] = m.x,
                            n.array[g + 1] = m.y,
                            n.array[g + 2] = m.z,
                            n.array[g + 3] = m.w,
                            g += 4;
                        Qa.bindBuffer(Qa.ARRAY_BUFFER, n.buffer),
                            Qa.bufferData(Qa.ARRAY_BUFFER, n.array, b)
                    }
                }
                function s(a, b) {
                    var c, d, e, f, g, h, i, j, k, l, m, n = a.vertices,
                        o = a.colors,
                        p = n.length,
                        q = o.length,
                        r = a.__vertexArray,
                        s = a.__colorArray,
                        t = a.verticesNeedUpdate,
                        u = a.colorsNeedUpdate,
                        v = a.__webglCustomAttributesList;
                    if (t) {
                        for (c = 0; c < p; c++) e = n[c],
                            f = 3 * c,
                            r[f] = e.x,
                            r[f + 1] = e.y,
                            r[f + 2] = e.z;
                        Qa.bindBuffer(Qa.ARRAY_BUFFER, a.__webglVertexBuffer),
                            Qa.bufferData(Qa.ARRAY_BUFFER, r, b)
                    }
                    if (u) {
                        for (d = 0; d < q; d++) g = o[d],
                            f = 3 * d,
                            s[f] = g.r,
                            s[f + 1] = g.g,
                            s[f + 2] = g.b;
                        Qa.bindBuffer(Qa.ARRAY_BUFFER, a.__webglColorBuffer),
                            Qa.bufferData(Qa.ARRAY_BUFFER, s, b)
                    }
                    if (v) for (h = 0, i = v.length; h < i; h++) if (m = v[h], m.needsUpdate && (void 0 === m.boundTo || "vertices" === m.boundTo)) {
                        if (f = 0, k = m.value.length, 1 === m.size) for (j = 0; j < k; j++) m.array[j] = m.value[j];
                        else if (2 === m.size) for (j = 0; j < k; j++) l = m.value[j],
                            m.array[f] = l.x,
                            m.array[f + 1] = l.y,
                            f += 2;
                        else if (3 === m.size) if ("c" === m.type) for (j = 0; j < k; j++) l = m.value[j],
                            m.array[f] = l.r,
                            m.array[f + 1] = l.g,
                            m.array[f + 2] = l.b,
                            f += 3;
                        else for (j = 0; j < k; j++) l = m.value[j],
                                m.array[f] = l.x,
                                m.array[f + 1] = l.y,
                                m.array[f + 2] = l.z,
                                f += 3;
                        else if (4 === m.size) for (j = 0; j < k; j++) l = m.value[j],
                            m.array[f] = l.x,
                            m.array[f + 1] = l.y,
                            m.array[f + 2] = l.z,
                            m.array[f + 3] = l.w,
                            f += 4;
                        Qa.bindBuffer(Qa.ARRAY_BUFFER, m.buffer),
                            Qa.bufferData(Qa.ARRAY_BUFFER, m.array, b)
                    }
                }
                function t(a, b, c, d, e) {
                    if (a.__inittedArrays) {
                        var f, g, h, i, j, k, l, m, n, r, s, t, u, v, w, x, y, z, A, B, C, D, E, F, G, H, I, J = o(e),
                            K = p(e),
                            L = q(e),
                            M = J === THREE.SmoothShading,
                            N = 0,
                            O = 0,
                            P = 0,
                            Q = 0,
                            R = 0,
                            S = 0,
                            T = 0,
                            U = 0,
                            V = 0,
                            W = 0,
                            X = a.__vertexArray,
                            Y = a.__uvArray,
                            Z = a.__uv2Array,
                            $ = a.__normalArray,
                            _ = a.__tangentArray,
                            aa = a.__colorArray,
                            ba = a.__webglCustomAttributesList,
                            ca = a.__faceArray,
                            da = a.__lineArray,
                            ea = b.geometry,
                            fa = ea.verticesNeedUpdate,
                            ga = ea.elementsNeedUpdate,
                            ha = ea.uvsNeedUpdate,
                            ia = ea.normalsNeedUpdate,
                            ja = ea.tangentsNeedUpdate,
                            ka = ea.colorsNeedUpdate,
                            la = ea.vertices,
                            ma = a.faces3,
                            na = ea.faces,
                            oa = ea.faceVertexUvs[0],
                            pa = ea.faceVertexUvs[1];
                        if (fa) {
                            for (f = 0, g = ma.length; f < g; f++) i = na[ma[f]],
                                t = la[i.a],
                                u = la[i.b],
                                v = la[i.c],
                                X[O] = t.x,
                                X[O + 1] = t.y,
                                X[O + 2] = t.z,
                                X[O + 3] = u.x,
                                X[O + 4] = u.y,
                                X[O + 5] = u.z,
                                X[O + 6] = v.x,
                                X[O + 7] = v.y,
                                X[O + 8] = v.z,
                                O += 9;
                            Qa.bindBuffer(Qa.ARRAY_BUFFER, a.__webglVertexBuffer),
                                Qa.bufferData(Qa.ARRAY_BUFFER, X, c)
                        }
                        if (ka && K) {
                            for (f = 0, g = ma.length; f < g; f++) i = na[ma[f]],
                                l = i.vertexColors,
                                m = i.color,
                                3 === l.length && K === THREE.VertexColors ? (z = l[0], A = l[1], B = l[2]) : (z = m, A = m, B = m),
                                aa[V] = z.r,
                                aa[V + 1] = z.g,
                                aa[V + 2] = z.b,
                                aa[V + 3] = A.r,
                                aa[V + 4] = A.g,
                                aa[V + 5] = A.b,
                                aa[V + 6] = B.r,
                                aa[V + 7] = B.g,
                                aa[V + 8] = B.b,
                                V += 9;
                            V > 0 && (Qa.bindBuffer(Qa.ARRAY_BUFFER, a.__webglColorBuffer), Qa.bufferData(Qa.ARRAY_BUFFER, aa, c))
                        }
                        if (ja && ea.hasTangents) {
                            for (f = 0, g = ma.length; f < g; f++) i = na[ma[f]],
                                n = i.vertexTangents,
                                w = n[0],
                                x = n[1],
                                y = n[2],
                                _[T] = w.x,
                                _[T + 1] = w.y,
                                _[T + 2] = w.z,
                                _[T + 3] = w.w,
                                _[T + 4] = x.x,
                                _[T + 5] = x.y,
                                _[T + 6] = x.z,
                                _[T + 7] = x.w,
                                _[T + 8] = y.x,
                                _[T + 9] = y.y,
                                _[T + 10] = y.z,
                                _[T + 11] = y.w,
                                T += 12;
                            Qa.bindBuffer(Qa.ARRAY_BUFFER, a.__webglTangentBuffer),
                                Qa.bufferData(Qa.ARRAY_BUFFER, _, c)
                        }
                        if (ia && J) {
                            for (f = 0, g = ma.length; f < g; f++) if (i = na[ma[f]], j = i.vertexNormals, k = i.normal, 3 === j.length && M) for (C = 0; C < 3; C++) E = j[C],
                                $[S] = E.x,
                                $[S + 1] = E.y,
                                $[S + 2] = E.z,
                                S += 3;
                            else for (C = 0; C < 3; C++) $[S] = k.x,
                                    $[S + 1] = k.y,
                                    $[S + 2] = k.z,
                                    S += 3;
                            Qa.bindBuffer(Qa.ARRAY_BUFFER, a.__webglNormalBuffer),
                                Qa.bufferData(Qa.ARRAY_BUFFER, $, c)
                        }
                        if (ha && oa && L) {
                            for (f = 0, g = ma.length; f < g; f++) if (h = ma[f], void 0 !== (r = oa[h])) for (C = 0; C < 3; C++) F = r[C],
                                Y[P] = F.x,
                                Y[P + 1] = F.y,
                                P += 2;
                            P > 0 && (Qa.bindBuffer(Qa.ARRAY_BUFFER, a.__webglUVBuffer), Qa.bufferData(Qa.ARRAY_BUFFER, Y, c))
                        }
                        if (ha && pa && L) {
                            for (f = 0, g = ma.length; f < g; f++) if (h = ma[f], void 0 !== (s = pa[h])) for (C = 0; C < 3; C++) G = s[C],
                                Z[Q] = G.x,
                                Z[Q + 1] = G.y,
                                Q += 2;
                            Q > 0 && (Qa.bindBuffer(Qa.ARRAY_BUFFER, a.__webglUV2Buffer), Qa.bufferData(Qa.ARRAY_BUFFER, Z, c))
                        }
                        if (ga) {
                            for (f = 0, g = ma.length; f < g; f++) ca[R] = N,
                                ca[R + 1] = N + 1,
                                ca[R + 2] = N + 2,
                                R += 3,
                                da[U] = N,
                                da[U + 1] = N + 1,
                                da[U + 2] = N,
                                da[U + 3] = N + 2,
                                da[U + 4] = N + 1,
                                da[U + 5] = N + 2,
                                U += 6,
                                N += 3;
                            Qa.bindBuffer(Qa.ELEMENT_ARRAY_BUFFER, a.__webglFaceBuffer),
                                Qa.bufferData(Qa.ELEMENT_ARRAY_BUFFER, ca, c),
                                Qa.bindBuffer(Qa.ELEMENT_ARRAY_BUFFER, a.__webglLineBuffer),
                                Qa.bufferData(Qa.ELEMENT_ARRAY_BUFFER, da, c)
                        }
                        if (ba) for (C = 0, D = ba.length; C < D; C++) if (I = ba[C], I.__original.needsUpdate) {
                            if (W = 0, 1 === I.size) {
                                if (void 0 === I.boundTo || "vertices" === I.boundTo) for (f = 0, g = ma.length; f < g; f++) i = na[ma[f]],
                                    I.array[W] = I.value[i.a],
                                    I.array[W + 1] = I.value[i.b],
                                    I.array[W + 2] = I.value[i.c],
                                    W += 3;
                                else if ("faces" === I.boundTo) for (f = 0, g = ma.length; f < g; f++) H = I.value[ma[f]],
                                    I.array[W] = H,
                                    I.array[W + 1] = H,
                                    I.array[W + 2] = H,
                                    W += 3
                            } else if (2 === I.size) {
                                if (void 0 === I.boundTo || "vertices" === I.boundTo) for (f = 0, g = ma.length; f < g; f++) i = na[ma[f]],
                                    t = I.value[i.a],
                                    u = I.value[i.b],
                                    v = I.value[i.c],
                                    I.array[W] = t.x,
                                    I.array[W + 1] = t.y,
                                    I.array[W + 2] = u.x,
                                    I.array[W + 3] = u.y,
                                    I.array[W + 4] = v.x,
                                    I.array[W + 5] = v.y,
                                    W += 6;
                                else if ("faces" === I.boundTo) for (f = 0, g = ma.length; f < g; f++) H = I.value[ma[f]],
                                    t = H,
                                    u = H,
                                    v = H,
                                    I.array[W] = t.x,
                                    I.array[W + 1] = t.y,
                                    I.array[W + 2] = u.x,
                                    I.array[W + 3] = u.y,
                                    I.array[W + 4] = v.x,
                                    I.array[W + 5] = v.y,
                                    W += 6
                            } else if (3 === I.size) {
                                var qa;
                                if (qa = "c" === I.type ? ["r", "g", "b"] : ["x", "y", "z"], void 0 === I.boundTo || "vertices" === I.boundTo) for (f = 0, g = ma.length; f < g; f++) i = na[ma[f]],
                                    t = I.value[i.a],
                                    u = I.value[i.b],
                                    v = I.value[i.c],
                                    I.array[W] = t[qa[0]],
                                    I.array[W + 1] = t[qa[1]],
                                    I.array[W + 2] = t[qa[2]],
                                    I.array[W + 3] = u[qa[0]],
                                    I.array[W + 4] = u[qa[1]],
                                    I.array[W + 5] = u[qa[2]],
                                    I.array[W + 6] = v[qa[0]],
                                    I.array[W + 7] = v[qa[1]],
                                    I.array[W + 8] = v[qa[2]],
                                    W += 9;
                                else if ("faces" === I.boundTo) for (f = 0, g = ma.length; f < g; f++) H = I.value[ma[f]],
                                    t = H,
                                    u = H,
                                    v = H,
                                    I.array[W] = t[qa[0]],
                                    I.array[W + 1] = t[qa[1]],
                                    I.array[W + 2] = t[qa[2]],
                                    I.array[W + 3] = u[qa[0]],
                                    I.array[W + 4] = u[qa[1]],
                                    I.array[W + 5] = u[qa[2]],
                                    I.array[W + 6] = v[qa[0]],
                                    I.array[W + 7] = v[qa[1]],
                                    I.array[W + 8] = v[qa[2]],
                                    W += 9;
                                else if ("faceVertices" === I.boundTo) for (f = 0, g = ma.length; f < g; f++) H = I.value[ma[f]],
                                    t = H[0],
                                    u = H[1],
                                    v = H[2],
                                    I.array[W] = t[qa[0]],
                                    I.array[W + 1] = t[qa[1]],
                                    I.array[W + 2] = t[qa[2]],
                                    I.array[W + 3] = u[qa[0]],
                                    I.array[W + 4] = u[qa[1]],
                                    I.array[W + 5] = u[qa[2]],
                                    I.array[W + 6] = v[qa[0]],
                                    I.array[W + 7] = v[qa[1]],
                                    I.array[W + 8] = v[qa[2]],
                                    W += 9
                            } else if (4 === I.size) if (void 0 === I.boundTo || "vertices" === I.boundTo) for (f = 0, g = ma.length; f < g; f++) i = na[ma[f]],
                                t = I.value[i.a],
                                u = I.value[i.b],
                                v = I.value[i.c],
                                I.array[W] = t.x,
                                I.array[W + 1] = t.y,
                                I.array[W + 2] = t.z,
                                I.array[W + 3] = t.w,
                                I.array[W + 4] = u.x,
                                I.array[W + 5] = u.y,
                                I.array[W + 6] = u.z,
                                I.array[W + 7] = u.w,
                                I.array[W + 8] = v.x,
                                I.array[W + 9] = v.y,
                                I.array[W + 10] = v.z,
                                I.array[W + 11] = v.w,
                                W += 12;
                            else if ("faces" === I.boundTo) for (f = 0, g = ma.length; f < g; f++) H = I.value[ma[f]],
                                t = H,
                                u = H,
                                v = H,
                                I.array[W] = t.x,
                                I.array[W + 1] = t.y,
                                I.array[W + 2] = t.z,
                                I.array[W + 3] = t.w,
                                I.array[W + 4] = u.x,
                                I.array[W + 5] = u.y,
                                I.array[W + 6] = u.z,
                                I.array[W + 7] = u.w,
                                I.array[W + 8] = v.x,
                                I.array[W + 9] = v.y,
                                I.array[W + 10] = v.z,
                                I.array[W + 11] = v.w,
                                W += 12;
                            else if ("faceVertices" === I.boundTo) for (f = 0, g = ma.length; f < g; f++) H = I.value[ma[f]],
                                t = H[0],
                                u = H[1],
                                v = H[2],
                                I.array[W] = t.x,
                                I.array[W + 1] = t.y,
                                I.array[W + 2] = t.z,
                                I.array[W + 3] = t.w,
                                I.array[W + 4] = u.x,
                                I.array[W + 5] = u.y,
                                I.array[W + 6] = u.z,
                                I.array[W + 7] = u.w,
                                I.array[W + 8] = v.x,
                                I.array[W + 9] = v.y,
                                I.array[W + 10] = v.z,
                                I.array[W + 11] = v.w,
                                W += 12;
                            Qa.bindBuffer(Qa.ARRAY_BUFFER, I.buffer),
                                Qa.bufferData(Qa.ARRAY_BUFFER, I.array, c)
                        }
                        d && (delete a.__inittedArrays, delete a.__colorArray, delete a.__normalArray, delete a.__tangentArray, delete a.__uvArray, delete a.__uv2Array, delete a.__faceArray, delete a.__vertexArray, delete a.__lineArray, delete a.__skinIndexArray, delete a.__skinWeightArray)
                    }
                }
                function u(a) {
                    if (a.streamingDraw) {
                        if (!a.streamingIndex) {
                            var b = a.attributes.index;
                            b && (b.buffer = Qa.createBuffer(), Qa.bindBuffer(Qa.ELEMENT_ARRAY_BUFFER, b.buffer), Qa.bufferData(Qa.ELEMENT_ARRAY_BUFFER, b.array || a.ib, Qa.STATIC_DRAW))
                        }
                    } else {
                        a.vb && void 0 === a.vbbuffer && (a.vbbuffer = Qa.createBuffer(), a.vbNeedsUpdate = !0),
                        a.ib && void 0 === a.ibbuffer && (a.ibbuffer = Qa.createBuffer(), Qa.bindBuffer(Qa.ELEMENT_ARRAY_BUFFER, a.ibbuffer), Qa.bufferData(Qa.ELEMENT_ARRAY_BUFFER, a.ib, Qa.STATIC_DRAW)),
                        a.iblines && void 0 === a.iblinesbuffer && (a.iblinesbuffer = Qa.createBuffer(), Qa.bindBuffer(Qa.ELEMENT_ARRAY_BUFFER, a.iblinesbuffer), Qa.bufferData(Qa.ELEMENT_ARRAY_BUFFER, a.iblines, Qa.STATIC_DRAW));
                        for (var c = a.attributes,
                                 d = a.attributesKeys,
                                 e = 0,
                                 f = d.length; e < f; e++) {
                            var g = d[e],
                                h = c[g],
                                i = "index" === g;
                            if (h.array && void 0 === h.buffer && (h.buffer = Qa.createBuffer(), h.needsUpdate = !0), !0 === h.needsUpdate) {
                                var j = i ? Qa.ELEMENT_ARRAY_BUFFER: Qa.ARRAY_BUFFER;
                                Qa.bindBuffer(j, h.buffer),
                                    Qa.bufferData(j, h.array, Qa.STATIC_DRAW),
                                    h.needsUpdate = !1
                            }
                        }
                        a.vbNeedsUpdate && (Qa.bindBuffer(Qa.ARRAY_BUFFER, a.vbbuffer), Qa.bufferData(Qa.ARRAY_BUFFER, a.vb, Qa.STATIC_DRAW), a.vbNeedsUpdate = !1, a.discardAfterUpload && (a.vb = null))
                    }
                }
                function v(a, b, c, d) {
                    var e;
                    if (c.streamingDraw) return c.vaos = null,
                        !1;
                    if (c.offsets && c.offsets.length > 1) return c.vaos = null,
                        !1;
                    if (!Ta) return c.vaos = null,
                        !1;
                    if (void 0 === c.vaos && (c.vaos = []), e = Ta.createVertexArrayOES(), c.vaos.push({
                            geomhash: b.id,
                            uv: d,
                            vao: e
                        }), Ta.bindVertexArrayOES(e), a.isEdgeMaterial) Qa.bindBuffer(Qa.ELEMENT_ARRAY_BUFFER, c.iblinesbuffer);
                    else {
                        var f = c.attributes.index;
                        f && Qa.bindBuffer(Qa.ELEMENT_ARRAY_BUFFER, c.ibbuffer || f.buffer)
                    }
                    for (var g = null,
                             h = b.attributes,
                             i = b.attributesKeys,
                             j = c.vbstride,
                             k = c.offsets && c.offsets.length ? c.offsets[0].index: 0, l = 0, m = i.length; l < m; l++) {
                        var n = i[l],
                            o = h[n];
                        if (o >= 0) {
                            var p = c.attributes[n];
                            if ("uv" === n && d && (p = c.attributes["uv" + (d + 1)]), !p) {
                                Ta.bindVertexArrayOES(null);
                                for (var q = 0; q < c.vaos.length; q++) Ta.deleteVertexArrayOES(c.vaos[q].vao);
                                return c.vaos = null,
                                    !1
                            }
                            var r = Qa.FLOAT,
                                s = p.bytesPerItem || 4;
                            1 === s ? r = Qa.UNSIGNED_BYTE: 2 === s && (r = Qa.UNSIGNED_SHORT),
                                Qa.enableVertexAttribArray(o),
                                void 0 !== p.itemOffset ? (g != c.vbbuffer && (Qa.bindBuffer(Qa.ARRAY_BUFFER, c.vbbuffer), g = c.vbbuffer), Qa.vertexAttribPointer(o, p.itemSize, r, !!p.normalize, 4 * j, 4 * (p.itemOffset + k * j))) : (Qa.bindBuffer(Qa.ARRAY_BUFFER, p.buffer), g = p.buffer, Qa.vertexAttribPointer(o, p.itemSize, r, !!p.normalize, 0, k * p.itemSize * s)),
                            Sa && Sa.vertexAttribDivisorANGLE(o, c.numInstances ? p.divisor || 0 : 0)
                        }
                    }
                    return ! 0
                }
                function w(a, b, c, d) {
                    var e = c.vaos;
                    if (e) for (var f = 0,
                                    g = e.length; f < g; f++) {
                        var h = e[f];
                        if (h.geomhash === b.id && h.uv === d) return Ta.bindVertexArrayOES(h.vao),
                            !0
                    } else if (null === e) return ! 1;
                    return v(a, b, c, d)
                }
                function x(a, b) {
                    var c = hb[a];
                    return c || (c = Qa.createBuffer(), hb[a] = c),
                        Qa.bindBuffer(Qa.ARRAY_BUFFER, c),
                        Qa.bufferData(Qa.ARRAY_BUFFER, b, Qa.DYNAMIC_DRAW),
                        c
                }
                function y(a, b, c, d, e, f) {
                    var g, h = b.attributes,
                        i = b.attributesKeys,
                        j = 0;
                    if (e) if (!e.buffer && c.streamingDraw) {
                        var k = hb.index;
                        k || (k = Qa.createBuffer(), hb.index = k),
                            Qa.bindBuffer(Qa.ELEMENT_ARRAY_BUFFER, k),
                            a.isEdgeMaterial ? Qa.bufferData(Qa.ELEMENT_ARRAY_BUFFER, c.iblines, Qa.DYNAMIC_DRAW) : Qa.bufferData(Qa.ELEMENT_ARRAY_BUFFER, e.array || c.ib, Qa.DYNAMIC_DRAW)
                    } else a.isEdgeMaterial ? Qa.bindBuffer(Qa.ELEMENT_ARRAY_BUFFER, c.iblinesbuffer) : Qa.bindBuffer(Qa.ELEMENT_ARRAY_BUFFER, c.ibbuffer || e.buffer);
                    for (var l = 0,
                             m = i.length; l < m; l++) {
                        var n = i[l],
                            o = h[n];
                        if (o >= 0) {
                            var p = c.attributes[n];
                            if ("uv" === n && f && (p = c.attributes["uv" + (f + 1)]), p) {
                                var q, r, s = void 0 !== p.itemOffset;
                                s ? (q = c.vbstride, r = p.itemOffset, j !== g && (c.streamingDraw ? j = x("interleavedVB", c.vb) : (j = c.vbbuffer, Qa.bindBuffer(Qa.ARRAY_BUFFER, j)), g = j)) : (q = p.itemSize, r = 0, c.streamingDraw ? j = x(n, p.array) : (j = p.buffer, Qa.bindBuffer(Qa.ARRAY_BUFFER, j)));
                                var t = Qa.FLOAT,
                                    u = p.bytesPerItem || 4;
                                1 === u ? t = Qa.UNSIGNED_BYTE: 2 === u && (t = Qa.UNSIGNED_SHORT),
                                s && (u = 4),
                                    qb.enableAttribute(o),
                                    Qa.vertexAttribPointer(o, p.itemSize, t, p.normalize, q * u, (r + d * q) * u),
                                Sa && Sa.vertexAttribDivisorANGLE(o, c.numInstances ? p.divisor || 0 : 0)
                            } else if (a.defaultAttributeValues) {
                                var v = a.defaultAttributeValues[n];
                                v && 2 === v.length ? Qa.vertexAttrib2fv(o, a.defaultAttributeValues[n]) : v && 3 === v.length ? Qa.vertexAttrib3fv(o, a.defaultAttributeValues[n]) : v && 4 === v.length && Qa.vertexAttrib4fv(o, a.defaultAttributeValues[n])
                            }
                        }
                    }
                    qb.disableUnusedAttributes()
                }
                function z(a, b) {
                    return a.object.renderOrder !== b.object.renderOrder ? a.object.renderOrder - b.object.renderOrder: a.z !== b.z ? a.z - b.z: a.id - b.id
                }
                function A(a, b) {
                    return a.object.renderOrder !== b.object.renderOrder ? a.object.renderOrder - b.object.renderOrder: a.material.id !== b.material.id ? a.material.id - b.material.id: a.z !== b.z ? b.z - a.z: a.id - b.id
                }
                function B(a) {
                    D(a, !0)
                }
                function C(a) {
                    D(a, !1)
                }
                function D(a, b, c) {
                    var d, e;
                    if (c || !1 !== a.visible) {
                        if (a instanceof THREE.Scene || a instanceof THREE.Group);
                        else if (a instanceof g) a.forEach(b ? B: C);
                        else if (L(a), a instanceof THREE.Light) Ja.push(a);
                        else {
                            var f = Ka[a.id];
                            if (f && (!1 === a.frustumCulled || !0 === ib.intersectsObject(a))) for (d = 0, e = f.length; d < e; d++) {
                                var h = f[d];
                                K(h),
                                    h.render = !0,
                                !0 === b && (lb.setFromMatrixPosition(a.matrixWorld), lb.applyProjection(jb), h.z = lb.z)
                            }
                        }
                        if (a.children) for (d = 0, e = a.children.length; d < e; d++) D(a.children[d], b, c)
                    }
                }
                function E(a, b) {
                    if (!b.getCustomOverrideMaterial) return b;
                    var c = b.getCustomOverrideMaterial(a);
                    return c || b
                }
                function F(a, b, c, d, e) {
                    for (var f, g = 0,
                             h = a.length; g < h; g++) {
                        var i = a[g],
                            j = i.object,
                            k = i.buffer;
                        if (e) f = E(i.material, e);
                        else {
                            if (! (f = i.material)) continue;
                            X(f)
                        }
                        if (f.twoPassTransparency) {
                            var l = f.side;
                            f.side = THREE.BackSide,
                                G(f, b, c, d, k, e, j),
                                f.side = THREE.FrontSide,
                                G(f, b, c, d, k, e, j),
                                f.side = l
                        } else G(f, b, c, d, k, e, j)
                    }
                }
                function G(a, b, c, d, e, f, g) {
                    if (Ua.setMaterialFaces(a), e instanceof THREE.BufferGeometry ? Ua.renderBufferDirect(b, c, d, a, e, g) : Ua.renderBuffer(b, c, d, a, e, g), a.decals) for (var h = a.decals,
                                                                                                                                                                                    i = 0,
                                                                                                                                                                                    j = h.length; i < j; i++) {
                        var k = h[i];
                        a = k.material,
                            X(a),
                            Ua.setMaterialFaces(a),
                        e instanceof THREE.BufferGeometry && Ua.renderBufferDirect(b, c, d, a, e, g, k.uv)
                    }
                }
                function H(a, b) {
                    if (a.visible && !a.hide) {
                        var c;
                        if (Vb) c = E(a.material, Vb);
                        else {
                            if (! (c = a.material)) return;
                            X(c)
                        }
                        if (c.twoPassTransparency) {
                            var d = c.side;
                            c.side = THREE.BackSide,
                                I(a, c),
                                c.side = THREE.FrontSide,
                                I(a, c),
                                c.side = d
                        } else I(a, c)
                    }
                }
                function I(a, b) {
                    if (Ua.setMaterialFaces(b), Ua.renderBufferDirect(Sb, Tb, Ub, b, a.geometry, a), b.decals) for (var c = b.decals,
                                                                                                                        d = 0,
                                                                                                                        e = c.length; d < e; d++) {
                        var f = c[d];
                        b = f.material,
                            X(b),
                            Ua.setMaterialFaces(b),
                            Ua.renderBufferDirect(Sb, Tb, Ub, b, a.geometry, a, f.uv)
                    }
                }
                function J(a, b, c, d, e, f) {
                    Sb = c,
                        Tb = d,
                        Ub = e,
                        Vb = f || null,
                        a.forEach(H, a.forceVisible ? 1 : 128, !1)
                }
                function K(a) {
                    var b = a.object,
                        c = a.buffer,
                        d = b.geometry,
                        e = b.material;
                    if (e instanceof THREE.MeshFaceMaterial) {
                        var f = d instanceof THREE.BufferGeometry ? 0 : c.materialIndex;
                        e = e.materials[f],
                            a.material = e,
                            e.transparent ? Pa.push(a) : Oa.push(a)
                    } else e && (a.material = e, e.transparent ? Pa.push(a) : Oa.push(a))
                }
                function L(a) {
                    void 0 === a.__webglInit && (a.__webglInit = !0, a.addEventListener("removed", Ib));
                    var d = a.geometry;
                    if (void 0 === d || void 0 === d.__webglInit && (d.__webglInit = !0, d.addEventListener("dispose", Jb), d instanceof THREE.BufferGeometry || (a instanceof THREE.Mesh ? N(a, d) : a instanceof THREE.Line ? void 0 === d.__webglVertexBuffer && (b(d), j(d, a), d.verticesNeedUpdate = !0, d.colorsNeedUpdate = !0, d.lineDistancesNeedUpdate = !0) : a instanceof THREE.PointCloud && void 0 === d.__webglVertexBuffer && (c(d), k(d, a), d.verticesNeedUpdate = !0, d.colorsNeedUpdate = !0))), void 0 === a.__webglActive) if (a.__webglActive = !0, a instanceof THREE.Mesh) {
                        if (d instanceof THREE.BufferGeometry) O(Ka, d, a);
                        else if (d instanceof THREE.Geometry) for (var e = Wb[d.id], f = 0, g = e.length; f < g; f++) O(Ka, e[f], a)
                    } else a instanceof THREE.Line || a instanceof THREE.PointCloud ? O(Ka, d, a) : (a instanceof THREE.ImmediateRenderObject || a.immediateRenderCallback) && P(La, a)
                }
                function M(a, b) {
                    for (var c, d, e = rb.get("OES_element_index_uint") ? 4294967296 : 65535, f = {},
                             g = a.morphTargets ? a.morphTargets.length: 0, h = a.morphNormals ? a.morphNormals.length: 0, i = {},
                             j = [], k = 0, l = a.faces.length; k < l; k++) {
                        var m = a.faces[k],
                            n = b ? m.materialIndex: 0;
                        n in f || (f[n] = {
                            hash: n,
                            counter: 0
                        }),
                            c = f[n].hash + "_" + f[n].counter,
                        c in i || (d = {
                            id: Xb++,
                            faces3: [],
                            materialIndex: n,
                            vertices: 0,
                            numMorphTargets: g,
                            numMorphNormals: h
                        },
                            i[c] = d, j.push(d)),
                        i[c].vertices + 3 > e && (f[n].counter += 1, (c = f[n].hash + "_" + f[n].counter) in i || (d = {
                            id: Xb++,
                            faces3: [],
                            materialIndex: n,
                            vertices: 0,
                            numMorphTargets: g,
                            numMorphNormals: h
                        },
                            i[c] = d, j.push(d))),
                            i[c].faces3.push(k),
                            i[c].vertices += 3
                    }
                    return j
                }
                function N(a, b) {
                    var c = a.material,
                        d = !1;
                    void 0 !== Wb[b.id] && !0 !== b.groupsNeedUpdate || (delete Ka[a.id], Wb[b.id] = M(b, c instanceof THREE.MeshFaceMaterial), b.groupsNeedUpdate = !1);
                    for (var e = Wb[b.id], f = 0, g = e.length; f < g; f++) {
                        var i = e[f];
                        void 0 === i.__webglVertexBuffer ? (h(i), l(i, a), b.verticesNeedUpdate = !0, b.morphTargetsNeedUpdate = !0, b.elementsNeedUpdate = !0, b.uvsNeedUpdate = !0, b.normalsNeedUpdate = !0, b.tangentsNeedUpdate = !0, b.colorsNeedUpdate = !0, d = !0) : d = !1,
                        (d || void 0 === a.__webglActive) && O(Ka, i, a)
                    }
                    a.__webglActive = !0
                }
                function O(a, b, c) {
                    var d = c.id;
                    a[d] = a[d] || [],
                        a[d].push({
                            id: d,
                            buffer: b,
                            object: c,
                            material: null,
                            z: 0
                        })
                }
                function P(a, b) {
                    a.push({
                        id: null,
                        object: b,
                        opaque: null,
                        transparent: null,
                        z: 0
                    })
                }
                function Q(a) {
                    var b, c, d = a.geometry;
                    if (d instanceof THREE.BufferGeometry) u(d);
                    else if (a instanceof THREE.Mesh) { ! 0 === d.groupsNeedUpdate && N(a, d);
                        for (var e = Wb[d.id], f = 0, g = e.length; f < g; f++) {
                            var h = e[f];
                            c = m(a, h),
                                b = c.attributes && R(c),
                            (d.verticesNeedUpdate || d.morphTargetsNeedUpdate || d.elementsNeedUpdate || d.uvsNeedUpdate || d.normalsNeedUpdate || d.colorsNeedUpdate || d.tangentsNeedUpdate || b) && t(h, a, Qa.DYNAMIC_DRAW, !d.dynamic, c)
                        }
                        d.verticesNeedUpdate = !1,
                            d.morphTargetsNeedUpdate = !1,
                            d.elementsNeedUpdate = !1,
                            d.uvsNeedUpdate = !1,
                            d.normalsNeedUpdate = !1,
                            d.colorsNeedUpdate = !1,
                            d.tangentsNeedUpdate = !1,
                        c.attributes && S(c)
                    } else a instanceof THREE.Line ? (c = m(a, d), b = c.attributes && R(c), (d.verticesNeedUpdate || d.colorsNeedUpdate || d.lineDistancesNeedUpdate || b) && r(d, Qa.DYNAMIC_DRAW), d.verticesNeedUpdate = !1, d.colorsNeedUpdate = !1, d.lineDistancesNeedUpdate = !1, c.attributes && S(c)) : a instanceof THREE.PointCloud && (c = m(a, d), b = c.attributes && R(c), (d.verticesNeedUpdate || d.colorsNeedUpdate || b) && s(d, Qa.DYNAMIC_DRAW), d.verticesNeedUpdate = !1, d.colorsNeedUpdate = !1, c.attributes && S(c))
                }
                function R(a) {
                    for (var b in a.attributes) if (a.attributes[b].needsUpdate) return ! 0;
                    return ! 1
                }
                function S(a) {
                    for (var b in a.attributes) a.attributes[b].needsUpdate = !1
                }
                function T(a) {
                    a instanceof THREE.Mesh || a instanceof THREE.PointCloud || a instanceof THREE.Line ? delete Ka[a.id] : (a instanceof THREE.ImmediateRenderObject || a.immediateRenderCallback) && U(La, a),
                        delete a.__webglInit,
                        delete a.__webglActive
                }
                function U(a, b) {
                    for (var c = a.length - 1; c >= 0; c--) a[c].object === b && a.splice(c, 1)
                }
                function V(a, b) {
                    if (b.textureMaps) for (var c = 0; c < e.PrismMaps.length; c++) {
                        var d = e.PrismMaps[c],
                            f = b.textureMaps[d + "_map"];
                        if (f) {
                            var g = f.textureObj.properties.booleans;
                            a[d] = {
                                S: !g.texture_URepeat.values[0],
                                T: !g.texture_VRepeat.values[0]
                            }
                        }
                    }
                }
                function W(a, b, c, d) {
                    a.addEventListener("dispose", Mb);
                    var f = Yb[a.type];
                    if (f) {
                        var g = THREE.ShaderLib[f];
                        a.__webglShader = {
                            uniforms: THREE.UniformsUtils.clone(g.uniforms),
                            vertexShader: g.vertexShader,
                            fragmentShader: g.fragmentShader
                        }
                    } else a.__webglShader = {
                        uniforms: a.uniforms,
                        vertexShader: a.vertexShader,
                        fragmentShader: a.fragmentShader
                    };
                    var h = va(b),
                        i = {
                            precision: ya,
                            precisionFragment: za,
                            supportsVertexTextures: zb,
                            haveTextureLod: !!rb.get("EXT_shader_texture_lod"),
                            map: !!a.map,
                            envMap: !!a.envMap,
                            irradianceMap: !!a.irradianceMap,
                            envIsSpherical: a.envMap && a.envMap.mapping == THREE.SphericalReflectionMapping,
                            envGammaEncoded: a.envMap && a.envMap.GammaEncoded,
                            irrGammaEncoded: a.irradianceMap && a.irradianceMap.GammaEncoded,
                            envRGBM: a.envMap && a.envMap.RGBM,
                            irrRGBM: a.irradianceMap && a.irradianceMap.RGBM,
                            lightMap: !!a.lightMap,
                            bumpMap: rb.get("OES_standard_derivatives") && !!a.bumpMap,
                            normalMap: rb.get("OES_standard_derivatives") && !!a.normalMap,
                            specularMap: !!a.specularMap,
                            alphaMap: !!a.alphaMap,
                            vertexColors: a.vertexColors,
                            vertexIds: a.vertexIds,
                            useInstancing: a.useInstancing,
                            wideLines: a.wideLines,
                            fog: c,
                            useFog: a.fog,
                            fogExp: c instanceof THREE.FogExp2,
                            sizeAttenuation: a.sizeAttenuation,
                            logarithmicDepthBuffer: Fa,
                            maxDirLights: h.directional,
                            maxPointLights: h.point,
                            maxSpotLights: h.spot,
                            maxHemiLights: h.hemi,
                            alphaTest: a.alphaTest,
                            metal: a.metal,
                            clearcoat: a.clearcoat,
                            wrapAround: a.wrapAround,
                            doubleSided: a.side === THREE.DoubleSide,
                            flipSided: a.side === THREE.BackSide,
                            mrtNormals: a.mrtNormals,
                            mrtIdBuffer: a.mrtIdBuffer,
                            vertexPrefix: ab,
                            fragmentPrefix: bb,
                            tonemapOutput: a.tonemapOutput,
                            packedNormals: a.packedNormals,
                            hatchPattern: !!a.hatchParams,
                            numCutplanes: a.cutplanes ? a.cutplanes.length: 0,
                            mapInvert: a.map && a.map.invert,
                            mapClampS: a.map && a.map.clampS,
                            mapClampT: a.map && a.map.clampT,
                            bumpMapClampS: a.bumpMap && a.bumpMap.clampS,
                            bumpMapClampT: a.bumpMap && a.bumpMap.clampT,
                            normalMapClampS: a.normalMap && a.normalMap.clampS,
                            normalMapClampT: a.normalMap && a.normalMap.clampT,
                            specularMapClampS: a.specularMap && a.specularMap.clampS,
                            specularMapClampT: a.specularMap && a.specularMap.clampT,
                            alphaMapInvert: a.alphaMap && a.alphaMap.invert,
                            alphaMapClampS: a.alphaMap && a.alphaMap.clampS,
                            alphaMapClampT: a.alphaMap && a.alphaMap.clampT
                        };
                    a.isPrismMaterial && (V(i, a), i.isPrism = !0);
                    var j = [];
                    f ? j.push(f) : (j.push(a.fragmentShader), j.push(a.vertexShader));
                    for (var k in a.defines) j.push(k),
                        j.push(a.defines[k]);
                    var l, m;
                    for (l in i) j.push(l),
                        j.push(i[l]);
                    var n, o = j.join();
                    for (l = 0, m = Va.length; l < m; l++) {
                        var p = Va[l];
                        if (p.code === o) {
                            n = p,
                                n.usedTimes++;
                            break
                        }
                    }
                    void 0 === n && (n = new e.WebGLProgram(Ua, o, a, i), Va.push(n), Ua.info.memory.programs = Va.length),
                    a.programs || (a.programs = []),
                        a.programs[_a] = n,
                    a.uniformsLists || (a.uniformsLists = []),
                        a.uniformsList = a.uniformsLists[_a] = [];
                    for (var q in a.__webglShader.uniforms) {
                        var r = n.uniforms[q];
                        r && a.uniformsList.push([a.__webglShader.uniforms[q], r])
                    }
                }
                function X(a) { ! 0 === a.transparent && qb.setBlending(a.blending, a.blendEquation, a.blendSrc, a.blendDst, a.blendEquationAlpha, a.blendSrcAlpha, a.blendDstAlpha),
                    qb.setDepthTest(a.depthTest),
                    qb.setDepthWrite(a.depthWrite),
                    qb.setPolygonOffset(a.polygonOffset, a.polygonOffsetFactor, a.polygonOffsetUnits)
                }
                function Y(a, b, c, d, e) {
                    cb = 0,
                        d.needsUpdate ? (d.program && Rb(d), W(d, b, c, e), d.needsUpdate = !1) : d.programs[_a] || W(d, b, c, e);
                    var g = !1,
                        h = !1,
                        i = !1;
                    d.uniformsList = d.uniformsLists[_a];
                    var j = d.program = d.programs[_a],
                        k = j.uniforms,
                        l = d.__webglShader.uniforms;
                    if (j.id !== Wa && (Qa.useProgram(j.program), Wa = j.id, g = !0, h = !0, i = !0), d.id !== Ya && ( - 1 === Ya && (i = !0), Ya = d.id, h = !0), (g || a !== Za) && (Qa.uniformMatrix4fv(k.projectionMatrix, !1, a.projectionMatrix.elements), Fa && Qa.uniform1f(k.logDepthBufFC, 2 / (Math.log(a.far + 1) / Math.LN2)), a !== Za && (Za = a), (d instanceof THREE.ShaderMaterial || d instanceof THREE.MeshPhongMaterial || d.isPrismMaterial || d.envMap) && null !== k.cameraPosition && (lb.setFromMatrixPosition(a.matrixWorld), Qa.uniform3f(k.cameraPosition, lb.x, lb.y, lb.z)), (d instanceof THREE.MeshPhongMaterial || d instanceof THREE.MeshLambertMaterial || d instanceof THREE.ShaderMaterial || d.isPrismMaterial || d.skinning) && (null !== k.viewMatrix && Qa.uniformMatrix4fv(k.viewMatrix, !1, a.matrixWorldInverse.elements), null !== k.viewMatrixInverse && Qa.uniformMatrix4fv(k.viewMatrixInverse, !1, kb.elements), k.mvpMatrix && Qa.uniformMatrix4fv(k.mvpMatrix, !1, jb.elements), i ? (ca(l, d), da(l, !0)) : da(l, !1))), h) {
                        c && d.fog && ba(l, c),
                        (d instanceof THREE.MeshPhongMaterial || d instanceof THREE.MeshLambertMaterial || d.isPrismMaterial || d.lights) && (nb && (i = !0, na(b), nb = !1), i ? (ha(l, ob), ia(l, !0)) : ia(l, !1)),
                        (d instanceof THREE.MeshBasicMaterial || d instanceof THREE.MeshLambertMaterial || d instanceof THREE.MeshPhongMaterial) && (Z(l, d), ca(l, d)),
                            d instanceof THREE.PointCloudMaterial ? $(l, d) : d instanceof THREE.LineBasicMaterial ? _(l, d) : d instanceof THREE.LineDashedMaterial ? (_(l, d), aa(l, d)) : d instanceof THREE.MeshPhongMaterial ? ea(l, d) : d instanceof THREE.MeshLambertMaterial ? ga(l, d) : d instanceof THREE.MeshDepthMaterial ? (l.mNear.value = a.near, l.mFar.value = a.far, l.opacity.value = d.opacity) : d instanceof THREE.MeshNormalMaterial ? l.opacity.value = d.opacity: d.isPrismMaterial && (fa(l, d), ca(l, d)),
                        d.wideLines && (l.view_size.value = new THREE.Vector2(window.innerWidth, window.innerHeight)),
                        f.ShadowRender && d.shadowMap && f.ShadowRender.RefreshUniformsShadow(l, d);
                        var m = l.cutplanes;
                        d.cutplanes && d.cutplanes.length > 0 && m && (m.value = d.cutplanes, m._array && m._array.length != 4 * d.cutplanes && (m._array = void 0)),
                        d.hatchParams && l.hatchParams && (l.hatchParams.value.copy(d.hatchParams), l.hatchTintColor.value.copy(d.hatchTintColor), l.hatchTintIntensity.value = d.hatchTintIntensity),
                            la(d.uniformsList)
                    }
                    ja(k, e, a),
                    null !== k.modelMatrix && Qa.uniformMatrix4fv(k.modelMatrix, !1, e.matrixWorld.elements);
                    var n;
                    if (k.modelId) {
                        k.dbId && (n = e.dbId || e.fragId || 0, Qa.uniform3f(k.dbId, (255 & n) / 255, (n >> 8 & 255) / 255, (n >> 16 & 255) / 255));
                        var o = e.modelId;
                        Qa.uniform3f(k.modelId, (255 & o) / 255, (o >> 8 & 255) / 255, (n >> 24 & 255) / 255)
                    } else null !== k.dbId && (n = e.dbId || e.fragId || 0, Qa.uniform3f(k.dbId, (255 & n) / 255, (n >> 8 & 255) / 255, (n >> 16 & 255) / 255));
                    if (k.themingColor) {
                        var p = e.themingColor;
                        p instanceof THREE.Vector4 ? Qa.uniform4f(k.themingColor, p.x, p.y, p.z, p.w) : Qa.uniform4f(k.themingColor, 0, 0, 0, 0)
                    }
                    return j
                }
                function Z(a, b) {
                    function c(a, b, c) {
                        var d = c.offset,
                            e = c.repeat;
                        if (b) {
                            var f = b.value;
                            c.matrix ? f.copy(c.matrix) : f.identity(),
                                f.elements[6] += d.x,
                                f.elements[7] += d.y,
                                f.elements[0] *= e.x,
                                f.elements[3] *= e.x,
                                f.elements[1] *= e.y,
                                f.elements[4] *= e.y
                        } else a.offsetRepeat.value.set(d.x, d.y, e.x, e.y)
                    }
                    a.opacity.value = b.opacity,
                        a.diffuse.value.copy(b.color),
                        a.map.value = b.map,
                        a.lightMap.value = b.lightMap,
                        a.specularMap.value = b.specularMap,
                        a.alphaMap.value = b.alphaMap,
                    b.bumpMap && (a.bumpMap.value = b.bumpMap, a.bumpScale.value = b.bumpScale),
                    b.normalMap && (a.normalMap.value = b.normalMap, a.normalScale.value.copy(b.normalScale)),
                    b.alphaMap && c(a, a.texMatrixAlpha, b.alphaMap);
                    var d;
                    b.normalMap ? d = b.normalMap: b.bumpMap && (d = b.bumpMap),
                    void 0 !== d && c(a, a.texMatrixBump, d);
                    var e;
                    b.map ? e = b.map: b.specularMap && (e = b.specularMap),
                    void 0 !== e && c(a, a.texMatrix, e),
                        a.envMap.value = b.envMap,
                    a.irradianceMap && (a.irradianceMap.value = b.irradianceMap),
                        a.reflectivity.value = b.reflectivity,
                        a.refractionRatio.value = b.refractionRatio
                }
                function $(a, b) {
                    _(a, b),
                        a.point_size.value = b.size
                }
                function _(a, b) {
                    a.diffuse.value = b.color,
                        a.opacity.value = b.opacity
                }
                function aa(a, b) {
                    a.dashSize.value = b.dashSize,
                        a.totalSize.value = b.dashSize + b.gapSize,
                        a.scale.value = b.scale
                }
                function ba(a, b) {
                    a.fogColor.value = b.color,
                        b instanceof THREE.Fog ? (a.fogNear.value = b.near, a.fogFar.value = b.far) : b instanceof THREE.FogExp2 && (a.fogDensity.value = b.density)
                }
                function ca(a, b) {
                    a.envMap && (a.envMap.value = b.envMap),
                    a.irradianceMap && (a.irradianceMap.value = b.irradianceMap),
                    a.envMapExposure && (a.envMapExposure.value = b.envMapExposure),
                    a.envRotationSin && a.envRotationCos && (a.envRotationSin.value = b.envRotationSin, a.envRotationCos.value = b.envRotationCos)
                }
                function da(a, b) {
                    a.envMap && (a.envMap.needsUpdate = b),
                    a.irradianceMap && (a.irradianceMap.needsUpdate = b),
                    a.envMapExposure && (a.envMapExposure.needsUpdate = b)
                }
                function ea(a, b) {
                    if (a.shininess.value = b.shininess, a.reflMipIndex) {
                        var c = Math.log(Math.max(1 + 1e-10, b.shininess));
                        a.reflMipIndex.value = Math.max(0, -.72134752 * c + 5.5)
                    }
                    a.emissive && a.emissive.value.copy(b.emissive),
                        a.specular.value.copy(b.specular),
                    a.exposureBias && (a.exposureBias.value = b.exposureBias)
                }
                function fa(a, b) {
                    function c(a, b, c) {
                        a[c].value = b[c],
                        null != b[c] && (a[c + "_texMatrix"].value = (new THREE.Matrix3).copy(b[c].matrix), a[c + "_invert"].value = b[c].invert)
                    }
                    function d(a, b, c) {
                        a[c].value = b[c],
                        null != b[c] && (a[c + "_texMatrix"].value = (new THREE.Matrix3).copy(b[c].matrix), a[c + "_bumpScale"].value = (new THREE.Vector2).copy(b[c].bumpScale), a[c + "_bumpmapType"].value = b[c].bumpmapType)
                    }
                    switch (a.exposureBias.value = b.exposureBias, a.surface_albedo.value = (new THREE.Color).copy(b.surface_albedo), a.surface_roughness.value = b.surface_roughness, a.surface_anisotropy.value = b.surface_anisotropy, a.surface_rotation.value = b.surface_rotation, c(a, b, "surface_albedo_map"), c(a, b, "surface_roughness_map"), c(a, b, "surface_cutout_map"), c(a, b, "surface_anisotropy_map"), c(a, b, "surface_rotation_map"), d(a, b, "surface_normal_map"), b.prismType) {
                        case "PrismOpaque":
                            a.opaque_albedo.value = (new THREE.Color).copy(b.opaque_albedo),
                                a.opaque_luminance_modifier.value = (new THREE.Color).copy(b.opaque_luminance_modifier),
                                a.opaque_f0.value = b.opaque_f0,
                                a.opaque_luminance.value = b.opaque_luminance,
                                c(a, b, "opaque_albedo_map"),
                                c(a, b, "opaque_luminance_modifier_map"),
                                c(a, b, "opaque_f0_map");
                            break;
                        case "PrismMetal":
                            a.metal_f0.value = (new THREE.Color).copy(b.metal_f0),
                                c(a, b, "metal_f0_map");
                            break;
                        case "PrismLayered":
                            a.layered_f0.value = b.layered_f0,
                                a.layered_diffuse.value = (new THREE.Color).copy(b.layered_diffuse),
                                a.layered_fraction.value = b.layered_fraction,
                                a.layered_bottom_f0.value = (new THREE.Color).copy(b.layered_bottom_f0),
                                a.layered_roughness.value = b.layered_roughness,
                                a.layered_anisotropy.value = b.layered_anisotropy,
                                a.layered_rotation.value = b.layered_rotation,
                                c(a, b, "layered_bottom_f0_map"),
                                c(a, b, "layered_f0_map"),
                                c(a, b, "layered_diffuse_map"),
                                c(a, b, "layered_fraction_map"),
                                c(a, b, "layered_roughness_map"),
                                c(a, b, "layered_anisotropy_map"),
                                c(a, b, "layered_rotation_map"),
                                d(a, b, "layered_normal_map");
                            break;
                        case "PrismTransparent":
                            a.transparent_color.value = (new THREE.Color).copy(b.transparent_color),
                                a.transparent_distance.value = b.transparent_distance,
                                a.transparent_ior.value = b.transparent_ior;
                            break;
                        case "PrismWood":
                            a.wood_fiber_cosine_enable.value = b.wood_fiber_cosine_enable,
                                a.wood_fiber_cosine_bands.value = b.wood_fiber_cosine_bands,
                                a.wood_fiber_cosine_weights.value = (new THREE.Vector4).copy(b.wood_fiber_cosine_weights),
                                a.wood_fiber_cosine_frequencies.value = (new THREE.Vector4).copy(b.wood_fiber_cosine_frequencies),
                                a.wood_fiber_perlin_enable.value = b.wood_fiber_perlin_enable,
                                a.wood_fiber_perlin_bands.value = b.wood_fiber_perlin_bands,
                                a.wood_fiber_perlin_weights.value = (new THREE.Vector4).copy(b.wood_fiber_perlin_weights),
                                a.wood_fiber_perlin_frequencies.value = (new THREE.Vector4).copy(b.wood_fiber_perlin_frequencies),
                                a.wood_fiber_perlin_scale_z.value = b.wood_fiber_perlin_scale_z,
                                a.wood_growth_perlin_enable.value = b.wood_growth_perlin_enable,
                                a.wood_growth_perlin_bands.value = b.wood_growth_perlin_bands,
                                a.wood_growth_perlin_weights.value = (new THREE.Vector4).copy(b.wood_growth_perlin_weights),
                                a.wood_growth_perlin_frequencies.value = (new THREE.Vector4).copy(b.wood_growth_perlin_frequencies),
                                a.wood_latewood_ratio.value = b.wood_latewood_ratio,
                                a.wood_earlywood_sharpness.value = b.wood_earlywood_sharpness,
                                a.wood_latewood_sharpness.value = b.wood_latewood_sharpness,
                                a.wood_ring_thickness.value = b.wood_ring_thickness,
                                a.wood_earlycolor_perlin_enable.value = b.wood_earlycolor_perlin_enable,
                                a.wood_earlycolor_perlin_bands.value = b.wood_earlycolor_perlin_bands,
                                a.wood_earlycolor_perlin_weights.value = (new THREE.Vector4).copy(b.wood_earlycolor_perlin_weights),
                                a.wood_earlycolor_perlin_frequencies.value = (new THREE.Vector4).copy(b.wood_earlycolor_perlin_frequencies),
                                a.wood_early_color.value = (new THREE.Color).copy(b.wood_early_color),
                                a.wood_use_manual_late_color.value = b.wood_use_manual_late_color,
                                a.wood_manual_late_color.value = (new THREE.Color).copy(b.wood_manual_late_color),
                                a.wood_latecolor_perlin_enable.value = b.wood_latecolor_perlin_enable,
                                a.wood_latecolor_perlin_bands.value = b.wood_latecolor_perlin_bands,
                                a.wood_latecolor_perlin_weights.value = (new THREE.Vector4).copy(b.wood_latecolor_perlin_weights),
                                a.wood_latecolor_perlin_frequencies.value = (new THREE.Vector4).copy(b.wood_latecolor_perlin_frequencies),
                                a.wood_late_color_power.value = b.wood_late_color_power,
                                a.wood_diffuse_perlin_enable.value = b.wood_diffuse_perlin_enable,
                                a.wood_diffuse_perlin_bands.value = b.wood_diffuse_perlin_bands,
                                a.wood_diffuse_perlin_weights.value = (new THREE.Vector4).copy(b.wood_diffuse_perlin_weights),
                                a.wood_diffuse_perlin_frequencies.value = (new THREE.Vector4).copy(b.wood_diffuse_perlin_frequencies),
                                a.wood_diffuse_perlin_scale_z.value = b.wood_diffuse_perlin_scale_z,
                                a.wood_use_pores.value = b.wood_use_pores,
                                a.wood_pore_type.value = b.wood_pore_type,
                                a.wood_pore_radius.value = b.wood_pore_radius,
                                a.wood_pore_cell_dim.value = b.wood_pore_cell_dim,
                                a.wood_pore_color_power.value = b.wood_pore_color_power,
                                a.wood_pore_depth.value = b.wood_pore_depth,
                                a.wood_use_rays.value = b.wood_use_rays,
                                a.wood_ray_color_power.value = b.wood_ray_color_power,
                                a.wood_ray_seg_length_z.value = b.wood_ray_seg_length_z,
                                a.wood_ray_num_slices.value = b.wood_ray_num_slices,
                                a.wood_ray_ellipse_z2x.value = b.wood_ray_ellipse_z2x,
                                a.wood_ray_ellipse_radius_x.value = b.wood_ray_ellipse_radius_x,
                                a.wood_use_latewood_bump.value = b.wood_use_latewood_bump,
                                a.wood_latewood_bump_depth.value = b.wood_latewood_bump_depth,
                                a.wood_use_groove_roughness.value = b.wood_use_groove_roughness,
                                a.wood_groove_roughness.value = b.wood_groove_roughness,
                                a.wood_diffuse_lobe_weight.value = b.wood_diffuse_lobe_weight,
                                c(a, b, "wood_curly_distortion_map"),
                            null != a.wood_curly_distortion_map.value && (a.wood_curly_distortion_map.value.minFilter = THREE.NearestFilter, a.wood_curly_distortion_map.value.magFilter = THREE.NearestFilter, a.wood_curly_distortion_enable.value = b.wood_curly_distortion_enable, a.wood_curly_distortion_scale.value = b.wood_curly_distortion_scale);
                            var e = 1 - b.wood_latewood_ratio,
                                f = b.wood_earlywood_sharpness * e,
                                g = b.wood_latewood_sharpness * b.wood_latewood_ratio,
                                h = e + g;
                            a.wood_ring_fraction.value = new THREE.Vector4(e, f, g, h),
                                a.wood_fall_rise.value = new THREE.Vector2(e - f, b.wood_latewood_ratio - g);
                            break;
                        default:
                            THREE.warn("Unknown prism type: " + b.prismType)
                    }
                    a.envExponentMin.value = b.envExponentMin,
                        a.envExponentMax.value = b.envExponentMax,
                        a.envExponentCount.value = b.envExponentCount
                }
                function ga(a, b) {
                    a.emissive.value.copy(b.emissive),
                    b.wrapAround && a.wrapRGB.value.copy(b.wrapRGB)
                }
                function ha(a, b) {
                    a.ambientLightColor.value = b.ambient,
                        a.directionalLightColor.value = b.directional.colors,
                        a.directionalLightDirection.value = b.directional.positions,
                        a.pointLightColor.value = b.point.colors,
                        a.pointLightPosition.value = b.point.positions,
                        a.pointLightDistance.value = b.point.distances,
                        a.spotLightColor.value = b.spot.colors,
                        a.spotLightPosition.value = b.spot.positions,
                        a.spotLightDistance.value = b.spot.distances,
                        a.spotLightDirection.value = b.spot.directions,
                        a.spotLightAngleCos.value = b.spot.anglesCos,
                        a.spotLightExponent.value = b.spot.exponents,
                        a.hemisphereLightSkyColor.value = b.hemi.skyColors,
                        a.hemisphereLightGroundColor.value = b.hemi.groundColors,
                        a.hemisphereLightDirection.value = b.hemi.positions
                }
                function ia(a, b) {
                    a.ambientLightColor.needsUpdate = b,
                        a.directionalLightColor.needsUpdate = b,
                        a.directionalLightDirection.needsUpdate = b,
                        a.pointLightColor.needsUpdate = b,
                        a.pointLightPosition.needsUpdate = b,
                        a.pointLightDistance.needsUpdate = b,
                        a.spotLightColor.needsUpdate = b,
                        a.spotLightPosition.needsUpdate = b,
                        a.spotLightDistance.needsUpdate = b,
                        a.spotLightDirection.needsUpdate = b,
                        a.spotLightAngleCos.needsUpdate = b,
                        a.spotLightExponent.needsUpdate = b,
                        a.hemisphereLightSkyColor.needsUpdate = b,
                        a.hemisphereLightGroundColor.needsUpdate = b,
                        a.hemisphereLightDirection.needsUpdate = b
                }
                function ja(a, b, c) {
                    Ma.multiplyMatrices(c.matrixWorldInverse, b.matrixWorld),
                        Qa.uniformMatrix4fv(a.modelViewMatrix, !1, Ma.elements),
                    a.normalMatrix && (Na.getNormalMatrix(Ma), Qa.uniformMatrix3fv(a.normalMatrix, !1, Na.elements))
                }
                function ka() {
                    var a = cb;
                    return a >= vb && THREE.warn("WebGLRenderer: trying to use " + a + " texture units while this GPU supports only " + vb),
                        cb += 1,
                        a
                }
                function la(a) {
                    for (var b, c, d, e = 0,
                             f = a.length; e < f; e++) {
                        var g = a[e][0];
                        if (!1 !== g.needsUpdate) {
                            var h, i, j = g.type,
                                k = g.value,
                                l = a[e][1];
                            switch (j) {
                                case "1i":
                                    Qa.uniform1i(l, k);
                                    break;
                                case "1f":
                                    Qa.uniform1f(l, k);
                                    break;
                                case "2f":
                                    Qa.uniform2f(l, k[0], k[1]);
                                    break;
                                case "3f":
                                    Qa.uniform3f(l, k[0], k[1], k[2]);
                                    break;
                                case "4f":
                                    Qa.uniform4f(l, k[0], k[1], k[2], k[3]);
                                    break;
                                case "1iv":
                                    Qa.uniform1iv(l, k);
                                    break;
                                case "3iv":
                                    Qa.uniform3iv(l, k);
                                    break;
                                case "1fv":
                                    Qa.uniform1fv(l, k);
                                    break;
                                case "2fv":
                                    Qa.uniform2fv(l, k);
                                    break;
                                case "3fv":
                                    Qa.uniform3fv(l, k);
                                    break;
                                case "4fv":
                                    Qa.uniform4fv(l, k);
                                    break;
                                case "Matrix3fv":
                                    Qa.uniformMatrix3fv(l, !1, k);
                                    break;
                                case "Matrix4fv":
                                    Qa.uniformMatrix4fv(l, !1, k);
                                    break;
                                case "i":
                                    Qa.uniform1i(l, k);
                                    break;
                                case "f":
                                    Qa.uniform1f(l, k);
                                    break;
                                case "v2":
                                    Qa.uniform2f(l, k.x, k.y);
                                    break;
                                case "v3":
                                    Qa.uniform3f(l, k.x, k.y, k.z);
                                    break;
                                case "v4":
                                    Qa.uniform4f(l, k.x, k.y, k.z, k.w);
                                    break;
                                case "c":
                                    Qa.uniform3f(l, k.r, k.g, k.b);
                                    break;
                                case "iv1":
                                    Qa.uniform1iv(l, k);
                                    break;
                                case "iv":
                                    Qa.uniform3iv(l, k);
                                    break;
                                case "fv1":
                                    Qa.uniform1fv(l, k);
                                    break;
                                case "fv":
                                    Qa.uniform3fv(l, k);
                                    break;
                                case "v2v":
                                    for (void 0 === g._array && (g._array = new Float32Array(2 * k.length)), h = 0, i = k.length; h < i; h++) d = 2 * h,
                                        g._array[d] = k[h].x,
                                        g._array[d + 1] = k[h].y;
                                    Qa.uniform2fv(l, g._array);
                                    break;
                                case "v3v":
                                    for (void 0 === g._array && (g._array = new Float32Array(3 * k.length)), h = 0, i = k.length; h < i; h++) d = 3 * h,
                                        g._array[d] = k[h].x,
                                        g._array[d + 1] = k[h].y,
                                        g._array[d + 2] = k[h].z;
                                    Qa.uniform3fv(l, g._array);
                                    break;
                                case "v4v":
                                    for (void 0 === g._array && (g._array = new Float32Array(4 * k.length)), h = 0, i = k.length; h < i; h++) d = 4 * h,
                                        g._array[d] = k[h].x,
                                        g._array[d + 1] = k[h].y,
                                        g._array[d + 2] = k[h].z,
                                        g._array[d + 3] = k[h].w;
                                    Qa.uniform4fv(l, g._array);
                                    break;
                                case "m3":
                                    Qa.uniformMatrix3fv(l, !1, k.elements);
                                    break;
                                case "m3v":
                                    for (void 0 === g._array && (g._array = new Float32Array(9 * k.length)), h = 0, i = k.length; h < i; h++) k[h].flattenToArrayOffset(g._array, 9 * h);
                                    Qa.uniformMatrix3fv(l, !1, g._array);
                                    break;
                                case "m4":
                                    Qa.uniformMatrix4fv(l, !1, k.elements);
                                    break;
                                case "m4v":
                                    for (void 0 === g._array && (g._array = new Float32Array(16 * k.length)), h = 0, i = k.length; h < i; h++) k[h].flattenToArrayOffset(g._array, 16 * h);
                                    Qa.uniformMatrix4fv(l, !1, g._array);
                                    break;
                                case "t":
                                    if (b = k, c = ka(), Qa.uniform1i(l, c), !b) continue;
                                    Array.isArray(b.image) && 6 === b.image.length || b instanceof THREE.CubeTexture ? b.needsUpdate ? qa(b, c) : (Qa.activeTexture(Qa.TEXTURE0 + c), Qa.bindTexture(Qa.TEXTURE_CUBE_MAP, b.__webglTextureCube)) : b instanceof THREE.WebGLRenderTargetCube ? ra(b, c) : Ua.setTexture(b, c);
                                    break;
                                case "tv":
                                    for (void 0 === g._array && (g._array = []), h = 0, i = g.value.length; h < i; h++) g._array[h] = ka();
                                    for (Qa.uniform1iv(l, g._array), h = 0, i = g.value.length; h < i; h++) b = g.value[h],
                                        c = g._array[h],
                                    b && Ua.setTexture(b, c);
                                    break;
                                default:
                                    THREE.warn("THREE.WebGLRenderer: Unknown uniform type: " + j)
                            }
                        }
                    }
                }
                function ma(a, b, c, d) {
                    a[b] = c.r * d,
                        a[b + 1] = c.g * d,
                        a[b + 2] = c.b * d
                }
                function na(a) {
                    var b, c, d, e, f, g, h, i, j = 0,
                        k = 0,
                        l = 0,
                        m = ob,
                        n = m.directional.colors,
                        o = m.directional.positions,
                        p = m.point.colors,
                        q = m.point.positions,
                        r = m.point.distances,
                        s = m.spot.colors,
                        t = m.spot.positions,
                        u = m.spot.distances,
                        v = m.spot.directions,
                        w = m.spot.anglesCos,
                        x = m.spot.exponents,
                        y = m.hemi.skyColors,
                        z = m.hemi.groundColors,
                        A = m.hemi.positions,
                        B = 0,
                        C = 0,
                        D = 0,
                        E = 0,
                        F = 0,
                        G = 0,
                        H = 0,
                        I = 0,
                        J = 0,
                        K = 0,
                        L = 0,
                        M = 0;
                    for (b = 0, c = a.length; b < c; b++) if (d = a[b], !d.onlyShadow) if (e = d.color, h = d.intensity, i = d.distance, d instanceof THREE.AmbientLight) {
                        if (!d.visible) continue;
                        j += e.r,
                            k += e.g,
                            l += e.b
                    } else if (d instanceof THREE.DirectionalLight) {
                        if (F += 1, !d.visible) continue;
                        mb.setFromMatrixPosition(d.matrixWorld),
                            lb.setFromMatrixPosition(d.target.matrixWorld),
                            mb.sub(lb),
                            mb.normalize(),
                            J = 3 * B,
                            o[J] = mb.x,
                            o[J + 1] = mb.y,
                            o[J + 2] = mb.z,
                            ma(n, J, e, h),
                            B += 1
                    } else if (d instanceof THREE.PointLight) {
                        if (G += 1, !d.visible) continue;
                        K = 3 * C,
                            ma(p, K, e, h),
                            lb.setFromMatrixPosition(d.matrixWorld),
                            q[K] = lb.x,
                            q[K + 1] = lb.y,
                            q[K + 2] = lb.z,
                            r[C] = i,
                            C += 1
                    } else if (d instanceof THREE.SpotLight) {
                        if (H += 1, !d.visible) continue;
                        L = 3 * D,
                            ma(s, L, e, h),
                            lb.setFromMatrixPosition(d.matrixWorld),
                            t[L] = lb.x,
                            t[L + 1] = lb.y,
                            t[L + 2] = lb.z,
                            u[D] = i,
                            mb.copy(lb),
                            lb.setFromMatrixPosition(d.target.matrixWorld),
                            mb.sub(lb),
                            mb.normalize(),
                            v[L] = mb.x,
                            v[L + 1] = mb.y,
                            v[L + 2] = mb.z,
                            w[D] = Math.cos(d.angle),
                            x[D] = d.exponent,
                            D += 1
                    } else if (d instanceof THREE.HemisphereLight) {
                        if (I += 1, !d.visible) continue;
                        mb.setFromMatrixPosition(d.matrixWorld),
                            mb.normalize(),
                            M = 3 * E,
                            A[M] = mb.x,
                            A[M + 1] = mb.y,
                            A[M + 2] = mb.z,
                            f = d.color,
                            g = d.groundColor,
                            ma(y, M, f, h),
                            ma(z, M, g, h),
                            E += 1
                    }
                    for (b = 3 * B, c = Math.max(n.length, 3 * F); b < c; b++) n[b] = 0;
                    for (b = 3 * C, c = Math.max(p.length, 3 * G); b < c; b++) p[b] = 0;
                    for (b = 3 * D, c = Math.max(s.length, 3 * H); b < c; b++) s[b] = 0;
                    for (b = 3 * E, c = Math.max(y.length, 3 * I); b < c; b++) y[b] = 0;
                    for (b = 3 * E, c = Math.max(z.length, 3 * I); b < c; b++) z[b] = 0;
                    m.directional.length = B,
                        m.point.length = C,
                        m.spot.length = D,
                        m.hemi.length = E,
                        m.ambient[0] = j,
                        m.ambient[1] = k,
                        m.ambient[2] = l
                }
                function oa(a, b, c) {
                    var d;
                    c ? (Qa.texParameteri(a, Qa.TEXTURE_WRAP_S, ua(b.wrapS)), Qa.texParameteri(a, Qa.TEXTURE_WRAP_T, ua(b.wrapT)), Qa.texParameteri(a, Qa.TEXTURE_MAG_FILTER, ua(b.magFilter)), Qa.texParameteri(a, Qa.TEXTURE_MIN_FILTER, ua(b.minFilter))) : (Qa.texParameteri(a, Qa.TEXTURE_WRAP_S, Qa.CLAMP_TO_EDGE), Qa.texParameteri(a, Qa.TEXTURE_WRAP_T, Qa.CLAMP_TO_EDGE), b.wrapS === THREE.ClampToEdgeWrapping && b.wrapT === THREE.ClampToEdgeWrapping || THREE.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping. ( " + b.sourceFile + " )"), Qa.texParameteri(a, Qa.TEXTURE_MAG_FILTER, ta(b.magFilter)), Qa.texParameteri(a, Qa.TEXTURE_MIN_FILTER, ta(b.minFilter)), b.minFilter !== THREE.NearestFilter && b.minFilter !== THREE.LinearFilter && THREE.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter. ( " + b.sourceFile + " )")),
                    (d = rb.get("EXT_texture_filter_anisotropic")) && b.type !== THREE.FloatType && b.type !== THREE.HalfFloatType && (b.anisotropy > 1 || b.__oldAnisotropy) && (Qa.texParameterf(a, d.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(b.anisotropy, Ua.getMaxAnisotropy())), b.__oldAnisotropy = b.anisotropy)
                }
                function pa(a, b) {
                    if (a.width <= b && a.height <= b) return a;
                    var c = Math.max(a.width, a.height),
                        d = Math.floor(a.width * b / c),
                        e = Math.floor(a.height * b / c),
                        f = document.createElement("canvas");
                    return f.width = d,
                        f.height = e,
                        f.getContext("2d").drawImage(a, 0, 0, a.width, a.height, 0, 0, d, e),
                        f
                }
                function qa(a, b) {
                    if (6 === a.image.length) if (a.needsUpdate) {
                        a.__webglTextureCube || (a.addEventListener("dispose", Kb), a.__webglTextureCube = Qa.createTexture(), Ua.info.memory.textures++),
                            Qa.activeTexture(Qa.TEXTURE0 + b),
                            Qa.bindTexture(Qa.TEXTURE_CUBE_MAP, a.__webglTextureCube),
                            Qa.pixelStorei(Qa.UNPACK_FLIP_Y_WEBGL, a.flipY);
                        var c, d = a instanceof THREE.CompressedTexture,
                            e = a.image[0] instanceof THREE.DataTexture,
                            f = [];
                        for (c = 0; c < 6; c++) ! Ua.autoScaleCubemaps || d || e ? f[c] = e ? a.image[c].image: a.image[c] : f[c] = pa(a.image[c], yb);
                        var g = f[0],
                            h = THREE.Math.isPowerOfTwo(g.width) && THREE.Math.isPowerOfTwo(g.height),
                            i = ua(a.format),
                            j = ua(a.type);
                        for (oa(Qa.TEXTURE_CUBE_MAP, a, h), c = 0; c < 6; c++) if (d) for (var k, l = f[c].mipmaps, m = 0, n = l.length; m < n; m++) k = l[m],
                            a.format !== THREE.RGBAFormat && a.format !== THREE.RGBFormat ? Eb().indexOf(i) > -1 ? Qa.compressedTexImage2D(Qa.TEXTURE_CUBE_MAP_POSITIVE_X + c, m, i, k.width, k.height, 0, k.data) : THREE.warn("Attempt to load unsupported compressed texture format") : Qa.texImage2D(Qa.TEXTURE_CUBE_MAP_POSITIVE_X + c, m, i, k.width, k.height, 0, i, j, k.data);
                        else e ? Qa.texImage2D(Qa.TEXTURE_CUBE_MAP_POSITIVE_X + c, 0, i, f[c].width, f[c].height, 0, i, j, f[c].data) : Qa.texImage2D(Qa.TEXTURE_CUBE_MAP_POSITIVE_X + c, 0, i, i, j, f[c]);
                        a.generateMipmaps && h && Qa.generateMipmap(Qa.TEXTURE_CUBE_MAP),
                            a.needsUpdate = !1,
                        a.onUpdate && a.onUpdate()
                    } else Qa.activeTexture(Qa.TEXTURE0 + b),
                        Qa.bindTexture(Qa.TEXTURE_CUBE_MAP, a.__webglTextureCube)
                }
                function ra(a, b) {
                    Qa.activeTexture(Qa.TEXTURE0 + b),
                        Qa.bindTexture(Qa.TEXTURE_CUBE_MAP, a.__webglTexture)
                }
                function sa(a) {
                    Qa.bindTexture(Qa.TEXTURE_2D, a.__webglTexture),
                        Qa.generateMipmap(Qa.TEXTURE_2D),
                        Qa.bindTexture(Qa.TEXTURE_2D, null)
                }
                function ta(a) {
                    return a === THREE.NearestFilter || a === THREE.NearestMipMapNearestFilter || a === THREE.NearestMipMapLinearFilter ? Qa.NEAREST: Qa.LINEAR
                }
                function ua(a) {
                    var b;
                    if (a === THREE.RepeatWrapping) return Qa.REPEAT;
                    if (a === THREE.ClampToEdgeWrapping) return Qa.CLAMP_TO_EDGE;
                    if (a === THREE.MirroredRepeatWrapping) return Qa.MIRRORED_REPEAT;
                    if (a === THREE.NearestFilter) return Qa.NEAREST;
                    if (a === THREE.NearestMipMapNearestFilter) return Qa.NEAREST_MIPMAP_NEAREST;
                    if (a === THREE.NearestMipMapLinearFilter) return Qa.NEAREST_MIPMAP_LINEAR;
                    if (a === THREE.LinearFilter) return Qa.LINEAR;
                    if (a === THREE.LinearMipMapNearestFilter) return Qa.LINEAR_MIPMAP_NEAREST;
                    if (a === THREE.LinearMipMapLinearFilter) return Qa.LINEAR_MIPMAP_LINEAR;
                    if (a === THREE.UnsignedByteType) return Qa.UNSIGNED_BYTE;
                    if (a === THREE.UnsignedShort4444Type) return Qa.UNSIGNED_SHORT_4_4_4_4;
                    if (a === THREE.UnsignedShort5551Type) return Qa.UNSIGNED_SHORT_5_5_5_1;
                    if (a === THREE.UnsignedShort565Type) return Qa.UNSIGNED_SHORT_5_6_5;
                    if (a === THREE.ByteType) return Qa.BYTE;
                    if (a === THREE.ShortType) return Qa.SHORT;
                    if (a === THREE.UnsignedShortType) return Qa.UNSIGNED_SHORT;
                    if (a === THREE.IntType) return Qa.INT;
                    if (a === THREE.UnsignedIntType) return Qa.UNSIGNED_INT;
                    if (a === THREE.FloatType) return Qa.FLOAT;
                    if (a === THREE.HalfFloatType) return 36193;
                    if (a === THREE.AlphaFormat) return Qa.ALPHA;
                    if (a === THREE.RGBFormat) return Qa.RGB;
                    if (a === THREE.RGBAFormat) return Qa.RGBA;
                    if (a === THREE.LuminanceFormat) return Qa.LUMINANCE;
                    if (a === THREE.LuminanceAlphaFormat) return Qa.LUMINANCE_ALPHA;
                    if (a === THREE.AddEquation) return Qa.FUNC_ADD;
                    if (a === THREE.SubtractEquation) return Qa.FUNC_SUBTRACT;
                    if (a === THREE.ReverseSubtractEquation) return Qa.FUNC_REVERSE_SUBTRACT;
                    if (a === THREE.ZeroFactor) return Qa.ZERO;
                    if (a === THREE.OneFactor) return Qa.ONE;
                    if (a === THREE.SrcColorFactor) return Qa.SRC_COLOR;
                    if (a === THREE.OneMinusSrcColorFactor) return Qa.ONE_MINUS_SRC_COLOR;
                    if (a === THREE.SrcAlphaFactor) return Qa.SRC_ALPHA;
                    if (a === THREE.OneMinusSrcAlphaFactor) return Qa.ONE_MINUS_SRC_ALPHA;
                    if (a === THREE.DstAlphaFactor) return Qa.DST_ALPHA;
                    if (a === THREE.OneMinusDstAlphaFactor) return Qa.ONE_MINUS_DST_ALPHA;
                    if (a === THREE.DstColorFactor) return Qa.DST_COLOR;
                    if (a === THREE.OneMinusDstColorFactor) return Qa.ONE_MINUS_DST_COLOR;
                    if (a === THREE.SrcAlphaSaturateFactor) return Qa.SRC_ALPHA_SATURATE;
                    if (null !== (b = rb.get("WEBGL_compressed_texture_s3tc"))) {
                        if (a === THREE.RGB_S3TC_DXT1_Format) return b.COMPRESSED_RGB_S3TC_DXT1_EXT;
                        if (a === THREE.RGBA_S3TC_DXT1_Format) return b.COMPRESSED_RGBA_S3TC_DXT1_EXT;
                        if (a === THREE.RGBA_S3TC_DXT3_Format) return b.COMPRESSED_RGBA_S3TC_DXT3_EXT;
                        if (a === THREE.RGBA_S3TC_DXT5_Format) return b.COMPRESSED_RGBA_S3TC_DXT5_EXT
                    }
                    if (null !== (b = rb.get("WEBGL_compressed_texture_pvrtc"))) {
                        if (a === THREE.RGB_PVRTC_4BPPV1_Format) return b.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;
                        if (a === THREE.RGB_PVRTC_2BPPV1_Format) return b.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;
                        if (a === THREE.RGBA_PVRTC_4BPPV1_Format) return b.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;
                        if (a === THREE.RGBA_PVRTC_2BPPV1_Format) return b.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG
                    }
                    if (null !== (b = rb.get("EXT_blend_minmax"))) {
                        if (a === THREE.MinEquation) return b.MIN_EXT;
                        if (a === THREE.MaxEquation) return b.MAX_EXT
                    }
                    return 0
                }
                function va(a) {
                    for (var b = 0,
                             c = 0,
                             d = 0,
                             e = 0,
                             f = 0,
                             g = a.length; f < g; f++) {
                        var h = a[f];
                        h.onlyShadow || (h instanceof THREE.DirectionalLight && b++, h instanceof THREE.PointLight && c++, h instanceof THREE.SpotLight && d++, h instanceof THREE.HemisphereLight && e++)
                    }
                    return {
                        directional: b,
                        point: c,
                        spot: d,
                        hemi: e
                    }
                }
                THREE.log("THREE.WebGLRenderer", THREE.REVISION),
                    a = a || {};
                var wa = void 0 !== a.canvas ? a.canvas: document.createElement("canvas"),
                    xa = window.devicePixelRatio || 1,
                    ya = void 0 !== a.precision ? a.precision: "highp",
                    za = ya,
                    Aa = void 0 !== a.alpha && a.alpha,
                    Ba = void 0 === a.premultipliedAlpha || a.premultipliedAlpha,
                    Ca = void 0 !== a.antialias && a.antialias,
                    Da = void 0 === a.stencil || a.stencil,
                    Ea = void 0 === a.preserveDrawingBuffer || a.preserveDrawingBuffer,
                    Fa = void 0 !== a.logarithmicDepthBuffer && a.logarithmicDepthBuffer,
                    Ga = new THREE.Color(0),
                    Ha = 0,
                    Ia = -1 != window.navigator.userAgent.indexOf("Firefox") && -1 != window.navigator.userAgent.indexOf("Mac OS"),
                    Ja = [],
                    Ka = {},
                    La = [],
                    Ma = new THREE.Matrix4,
                    Na = new THREE.Matrix3,
                    Oa = [],
                    Pa = [];
                this.domElement = wa,
                    this.context = null,
                    this.autoClear = !0,
                    this.autoClearColor = !0,
                    this.autoClearDepth = !0,
                    this.autoClearStencil = !0,
                    this.sortObjects = !0,
                    this.gammaInput = !1,
                    this.gammaOutput = !1,
                    this.maxMorphTargets = 8,
                    this.maxMorphNormals = 4,
                    this.autoScaleCubemaps = !0,
                    this.info = {
                        memory: {
                            programs: 0,
                            geometries: 0,
                            textures: 0
                        },
                        render: {
                            calls: 0,
                            vertices: 0,
                            faces: 0,
                            points: 0
                        }
                    };
                var Qa, Ra, Sa, Ta, Ua = this,
                    Va = [],
                    Wa = null,
                    Xa = null,
                    Ya = -1,
                    Za = null,
                    $a = "",
                    _a = 0,
                    ab = "",
                    bb = "",
                    cb = 0,
                    db = 0,
                    eb = 0,
                    fb = wa.width,
                    gb = wa.height,
                    hb = {},
                    ib = new THREE.Frustum,
                    jb = new THREE.Matrix4,
                    kb = new THREE.Matrix4,
                    lb = new THREE.Vector3,
                    mb = new THREE.Vector3,
                    nb = !0,
                    ob = {
                        ambient: [0, 0, 0],
                        directional: {
                            length: 0,
                            colors: [],
                            positions: []
                        },
                        point: {
                            length: 0,
                            colors: [],
                            positions: [],
                            distances: []
                        },
                        spot: {
                            length: 0,
                            colors: [],
                            positions: [],
                            distances: [],
                            directions: [],
                            anglesCos: [],
                            exponents: []
                        },
                        hemi: {
                            length: 0,
                            skyColors: [],
                            groundColors: [],
                            positions: []
                        }
                    };
                try {
                    var pb = {
                        alpha: Aa,
                        premultipliedAlpha: Ba,
                        antialias: Ca,
                        stencil: Da,
                        preserveDrawingBuffer: Ea
                    };
                    if (null === (Qa = wa.getContext("webgl", pb) || wa.getContext("experimental-webgl", pb))) throw null !== wa.getContext("webgl") ? "Error creating WebGL context with your selected attributes.": "Error creating WebGL context.";
                    0 == Qa.getShaderPrecisionFormat(Qa.FRAGMENT_SHADER, Qa.HIGH_FLOAT).precision && (za = "mediump"),
                        Qa = d.rescueFromPolymer(Qa),
                        wa.addEventListener("webglcontextlost",
                            function(a) {
                                a.preventDefault(),
                                    ub(),
                                    tb(),
                                    Ka = {}
                            },
                            !1)
                } catch(a) {
                    return void THREE.error(a)
                }
                var qb = new THREE.WebGLState(Qa, ua);
                void 0 === Qa.getShaderPrecisionFormat && (Qa.getShaderPrecisionFormat = function() {
                    return {
                        rangeMin: 1,
                        rangeMax: 1,
                        precision: 1
                    }
                });
                var rb = new THREE.WebGLExtensions(Qa);
                rb.get("OES_texture_float"),
                    rb.get("OES_texture_float_linear"),
                    rb.get("OES_texture_half_float"),
                    rb.get("OES_texture_half_float_linear"),
                    rb.get("OES_standard_derivatives"),
                    rb.get("EXT_shader_texture_lod"),
                    rb.get("EXT_texture_filter_anisotropic"),
                    rb.get("WEBGL_compressed_texture_s3tc"),
                    Ra = rb.get("WEBGL_draw_buffers"),
                    Sa = rb.get("ANGLE_instanced_arrays"),
                    Ta = rb.get("OES_vertex_array_object"),
                Fa && rb.get("EXT_frag_depth");
                var sb = function(a, b, c, d) { ! 0 === Ba && (a *= d, b *= d, c *= d),
                        Qa.clearColor(a, b, c, d)
                    },
                    tb = function() {
                        Qa.clearColor(0, 0, 0, 1),
                            Qa.clearDepth(1),
                            Qa.clearStencil(0),
                            Qa.enable(Qa.DEPTH_TEST),
                            Qa.depthFunc(Qa.LEQUAL),
                            Qa.frontFace(Qa.CCW),
                            Qa.cullFace(Qa.BACK),
                            Qa.enable(Qa.CULL_FACE),
                            Qa.enable(Qa.BLEND),
                            Qa.blendEquation(Qa.FUNC_ADD),
                            Qa.blendFunc(Qa.SRC_ALPHA, Qa.ONE_MINUS_SRC_ALPHA),
                            Qa.viewport(db, eb, fb, gb),
                            sb(Ga.r, Ga.g, Ga.b, Ha)
                    },
                    ub = function() {
                        Wa = null,
                            Za = null,
                            $a = "",
                            Ya = -1,
                            nb = !0,
                            qb.reset(),
                            qb.disableUnusedAttributes()
                    };
                tb(),
                    this.context = Qa,
                    this.state = qb;
                var vb = Qa.getParameter(Qa.MAX_TEXTURE_IMAGE_UNITS),
                    wb = Qa.getParameter(Qa.MAX_VERTEX_TEXTURE_IMAGE_UNITS),
                    xb = Qa.getParameter(Qa.MAX_TEXTURE_SIZE),
                    yb = Qa.getParameter(Qa.MAX_CUBE_MAP_TEXTURE_SIZE),
                    zb = wb > 0,
                    Ab = Qa.getShaderPrecisionFormat(Qa.VERTEX_SHADER, Qa.HIGH_FLOAT),
                    Bb = Qa.getShaderPrecisionFormat(Qa.VERTEX_SHADER, Qa.MEDIUM_FLOAT),
                    Cb = Qa.getShaderPrecisionFormat(Qa.FRAGMENT_SHADER, Qa.HIGH_FLOAT),
                    Db = Qa.getShaderPrecisionFormat(Qa.FRAGMENT_SHADER, Qa.MEDIUM_FLOAT),
                    Eb = function() {
                        var a;
                        return function() {
                            if (void 0 !== a) return a;
                            if (a = [], rb.get("WEBGL_compressed_texture_pvrtc") || rb.get("WEBGL_compressed_texture_s3tc")) for (var b = Qa.getParameter(Qa.COMPRESSED_TEXTURE_FORMATS), c = 0; c < b.length; c++) a.push(b[c]);
                            return a
                        }
                    } (),
                    Fb = Ab.precision > 0,
                    Gb = Bb.precision > 0;
                "highp" !== ya || Fb || (Gb ? (ya = "mediump", THREE.warn("WebGLRenderer: highp not supported, using mediump")) : (ya = "lowp", THREE.warn("WebGLRenderer: highp and mediump not supported, using lowp"))),
                "mediump" !== ya || Gb || (ya = "lowp", THREE.warn("WebGLRenderer: mediump not supported, using lowp")),
                    Fb = Cb.precision > 0,
                    Gb = Db.precision > 0,
                "highp" !== za || Fb || (Gb ? (za = "mediump", THREE.warn("WebGLRenderer: highp not supported, using mediump")) : (za = "lowp", THREE.warn("WebGLRenderer: highp and mediump not supported, using lowp"))),
                "mediump" !== za || Gb || (za = "lowp", THREE.warn("WebGLRenderer: mediump not supported, using lowp")),
                    this.getContext = function() {
                        return Qa
                    },
                    this.forceContextLoss = function() {
                        rb.get("WEBGL_lose_context").loseContext()
                    },
                    this.supportsVertexTextures = function() {
                        return zb
                    },
                    this.supportsFloatTextures = function() {
                        return rb.get("OES_texture_float")
                    },
                    this.supportsHalfFloatTextures = function() {
                        return rb.get("OES_texture_half_float_linear")
                    },
                    this.supportsStandardDerivatives = function() {
                        return rb.get("OES_standard_derivatives")
                    },
                    this.supportsCompressedTextureS3TC = function() {
                        return rb.get("WEBGL_compressed_texture_s3tc")
                    },
                    this.supportsMRT = function() {
                        return ! Ia && Ra
                    },
                    this.supportsInstancedArrays = function() {
                        return !! Sa
                    },
                    this.supportsBlendMinMax = function() {
                        return rb.get("EXT_blend_minmax")
                    },
                    this.getMaxAnisotropy = function() {
                        var a;
                        return function() {
                            if (void 0 !== a) return a;
                            var b = rb.get("EXT_texture_filter_anisotropic");
                            return a = null !== b ? Qa.getParameter(b.MAX_TEXTURE_MAX_ANISOTROPY_EXT) : 0
                        }
                    } (),
                    this.getPixelRatio = function() {
                        return xa
                    },
                    this.setPixelRatio = function(a) {
                        xa = a
                    },
                    this.setSize = function(a, b, c) {
                        wa.width = a * xa,
                            wa.height = b * xa,
                        !1 !== c && (wa.style.width = a + "px", wa.style.height = b + "px"),
                            this.setViewport(0, 0, a, b)
                    },
                    this.setViewport = function(a, b, c, d) {
                        db = a * xa,
                            eb = b * xa,
                            fb = c * xa,
                            gb = d * xa,
                            Qa.viewport(db, eb, fb, gb)
                    };
                var Hb = [];
                this.pushViewport = function() {
                    Hb.push(db),
                        Hb.push(eb),
                        Hb.push(fb),
                        Hb.push(gb)
                },
                    this.popViewport = function() {
                        var a = Hb.length - 4;
                        db = Hb[a],
                            eb = Hb[a + 1],
                            fb = Hb[a + 2],
                            gb = Hb[a + 3],
                            Qa.viewport(db, eb, fb, gb),
                            Hb.length = a
                    },
                    this.setScissor = function(a, b, c, d) {
                        Qa.scissor(a * xa, b * xa, c * xa, d * xa)
                    },
                    this.enableScissorTest = function(a) {
                        a ? Qa.enable(Qa.SCISSOR_TEST) : Qa.disable(Qa.SCISSOR_TEST)
                    },
                    this.getClearColor = function() {
                        return Ga
                    },
                    this.setClearColor = function(a, b) {
                        Ga.set(a),
                            Ha = void 0 !== b ? b: 1,
                            sb(Ga.r, Ga.g, Ga.b, Ha)
                    },
                    this.getClearAlpha = function() {
                        return Ha
                    },
                    this.setClearAlpha = function(a) {
                        Ha = a,
                            sb(Ga.r, Ga.g, Ga.b, Ha)
                    },
                    this.clear = function(a, b, c) {
                        var d = 0; (void 0 === a || a) && (d |= Qa.COLOR_BUFFER_BIT),
                        (void 0 === b || b) && (d |= Qa.DEPTH_BUFFER_BIT),
                        (void 0 === c || c) && (d |= Qa.STENCIL_BUFFER_BIT),
                            Qa.clear(d)
                    },
                    this.clearColor = function() {
                        Qa.clear(Qa.COLOR_BUFFER_BIT)
                    },
                    this.clearDepth = function() {
                        Qa.clear(Qa.DEPTH_BUFFER_BIT)
                    },
                    this.clearStencil = function() {
                        Qa.clear(Qa.STENCIL_BUFFER_BIT)
                    },
                    this.clearTarget = function(a, b, c, d) {
                        this.setRenderTarget(a),
                            this.clear(b, c, d)
                    },
                    this.resetGLState = ub;
                var Ib = function a(b) {
                        b.target.traverse(function(b) {
                            b.removeEventListener("remove", a),
                                T(b)
                        })
                    },
                    Jb = function a(b) {
                        var c = b.target;
                        c.removeEventListener("dispose", a),
                            Ob(c)
                    },
                    Kb = function a(b) {
                        var c = b.target;
                        c.removeEventListener("dispose", a),
                            Pb(c),
                            Ua.info.memory.textures--
                    },
                    Lb = function a(b) {
                        var c = b.target;
                        c.removeEventListener("dispose", a),
                            Qb(c),
                            Ua.info.memory.textures--
                    },
                    Mb = function a(b) {
                        var c = b.target;
                        c.removeEventListener("dispose", a),
                            Rb(c)
                    },
                    Nb = function(a) {
                        if (void 0 !== a.__webglVertexBuffer && (Qa.deleteBuffer(a.__webglVertexBuffer), a.__webglVertexBuffer = void 0), void 0 !== a.__webglNormalBuffer && (Qa.deleteBuffer(a.__webglNormalBuffer), a.__webglNormalBuffer = void 0), void 0 !== a.__webglTangentBuffer && (Qa.deleteBuffer(a.__webglTangentBuffer), a.__webglTangentBuffer = void 0), void 0 !== a.__webglColorBuffer && (Qa.deleteBuffer(a.__webglColorBuffer), a.__webglColorBuffer = void 0), void 0 !== a.__webglUVBuffer && (Qa.deleteBuffer(a.__webglUVBuffer), a.__webglUVBuffer = void 0), void 0 !== a.__webglUV2Buffer && (Qa.deleteBuffer(a.__webglUV2Buffer), a.__webglUV2Buffer = void 0), void 0 !== a.__webglSkinIndicesBuffer && (Qa.deleteBuffer(a.__webglSkinIndicesBuffer), a.__webglSkinIndicesBuffer = void 0), void 0 !== a.__webglSkinWeightsBuffer && (Qa.deleteBuffer(a.__webglSkinWeightsBuffer), a.__webglSkinWeightsBuffer = void 0), void 0 !== a.__webglFaceBuffer && (Qa.deleteBuffer(a.__webglFaceBuffer), a.__webglFaceBuffer = void 0), void 0 !== a.__webglLineBuffer && (Qa.deleteBuffer(a.__webglLineBuffer), a.__webglLineBuffer = void 0), void 0 !== a.__webglLineDistanceBuffer && (Qa.deleteBuffer(a.__webglLineDistanceBuffer), a.__webglLineDistanceBuffer = void 0), void 0 !== a.__webglCustomAttributesList) {
                            for (var b in a.__webglCustomAttributesList) Qa.deleteBuffer(a.__webglCustomAttributesList[b].buffer);
                            a.__webglCustomAttributesList = void 0
                        }
                        Ua.info.memory.geometries--
                    },
                    Ob = function(a) {
                        a.__webglInit = void 0;
                        var b, c, d, e;
                        if (a instanceof THREE.BufferGeometry) {
                            if (void 0 !== a.vbbuffer && (Qa.deleteBuffer(a.vbbuffer), a.vbbuffer = void 0), void 0 !== a.ibbuffer && (Qa.deleteBuffer(a.ibbuffer), a.ibbuffer = void 0), void 0 !== a.iblinesbuffer && (Qa.deleteBuffer(a.iblinesbuffer), a.iblinesbuffer = void 0), a.vaos) {
                                for (b = 0; b < a.vaos.length; b++) Ta.deleteVertexArrayOES(a.vaos[b].vao);
                                a.vaos = void 0
                            }
                            var f = a.attributes;
                            for (var g in f) void 0 !== f[g].buffer && (Qa.deleteBuffer(f[g].buffer), f[g].buffer = void 0);
                            Ua.info.memory.geometries--
                        } else {
                            var h = Wb[a.id];
                            if (void 0 !== h) {
                                for (b = 0, c = h.length; b < c; b++) {
                                    var i = h[b];
                                    if (void 0 !== i.numMorphTargets) {
                                        for (d = 0, e = i.numMorphTargets; d < e; d++) Qa.deleteBuffer(i.__webglMorphTargetsBuffers[d]);
                                        delete i.__webglMorphTargetsBuffers
                                    }
                                    if (void 0 !== i.numMorphNormals) {
                                        for (d = 0, e = i.numMorphNormals; d < e; d++) Qa.deleteBuffer(i.__webglMorphNormalsBuffers[d]);
                                        delete i.__webglMorphNormalsBuffers
                                    }
                                    Nb(i)
                                }
                                delete Wb[a.id]
                            } else Nb(a)
                        }
                    };
                this.deallocateGeometry = Ob;
                var Pb = function(a) {
                        if (a.__webglTextureCube) Qa.deleteTexture(a.__webglTextureCube),
                            a.__webglTextureCube = void 0;
                        else {
                            if (!a.__webglInit) return;
                            Qa.deleteTexture(a.__webglTexture),
                                a.__webglInit = void 0,
                                a.__webglTexture = void 0
                        }
                    },
                    Qb = function(a) {
                        a && a.__webglTexture && (Qa.deleteTexture(a.__webglTexture), Qa.deleteFramebuffer(a.__webglFramebuffer), Qa.deleteRenderbuffer(a.__webglRenderbuffer))
                    },
                    Rb = function(a) {
                        var b = !1;
                        a.program = void 0,
                            a.programs.forEach(function(a) {
                                    var c;
                                    if (void 0 !== a && void 0 != (c = a.program)) {
                                        var d, e, f;
                                        for (d = 0, e = Va.length; d < e; d++) if ((f = Va[d]) && f.program === c) {
                                            f.usedTimes--,
                                            0 === f.usedTimes && (Va[d] = void 0, Qa.deleteProgram(c), Ua.info.memory.programs--, b = !0);
                                            break
                                        }
                                    }
                                },
                                !1),
                            a.programs.length = 0,
                        !0 === b && (Va = Va.filter(function(a) {
                            return void 0 !== a
                        }))
                    };
                this.renderBufferDirect = function(a, b, c, d, e, f, g) {
                    if (!1 !== d.visible && (!d.isEdgeMaterial || e.iblines)) {
                        u(f.geometry);
                        var h = Y(a, b, c, d, f),
                            i = e.attributes,
                            j = !1,
                            k = d.wireframe ? 1 : 0,
                            l = "direct_" + e.id + (g ? "/" + g: "") + "_" + h.id + "_" + k;
                        l !== $a && ($a = l, j = !0);
                        var m = w(d, h, e, g || 0);
                        if (j = j && !m, j && qb.initAttributes(), f instanceof THREE.Mesh) {
                            var n, o = i.index;
                            if (o) {
                                var p, q, r = o.array ? o.array: e.ib;
                                d.isEdgeMaterial && (r = e.iblines),
                                    r instanceof Uint32Array && rb.get("OES_element_index_uint") ? (p = Qa.UNSIGNED_INT, q = 4) : (p = Qa.UNSIGNED_SHORT, q = 2);
                                var s = d.isEdgeMaterial ? null: e.offsets;
                                s && s.length > 1 && (j = !0);
                                var t = 0;
                                do {
                                    var v, x, z;
                                    s && s.length ? (v = s[t].index, x = s[t].start, z = s[t].count) : (v = 0, x = 0, z = r.length), j && y(d, h, e, v, o, g), n = Qa.TRIANGLES, e.isPoints ? n = Qa.POINTS: (e.isLines || d.isEdgeMaterial) && (n = Qa.LINES), e.numInstances ? Sa.drawElementsInstancedANGLE(n, z, p, x * q, e.numInstances) : Qa.drawElements(n, z, p, x * q)
                                } while ( s && ++ t < s . length )
                            } else {
                                j && y(d, h, e, 0, void 0, g);
                                var A = e.attributes.position;
                                n = Qa.TRIANGLES,
                                    e.isPoints ? n = Qa.POINTS: (e.isLines || d.isEdgeMaterial) && (n = Qa.LINES),
                                    e.numInstances ? Sa.drawArraysInstancedANGLE(n, 0, A.array.length / 3, e.numInstances) : Qa.drawArrays(n, 0, A.array.length / A.itemSize)
                            }
                        } else THREE.log("Only THREE.Mesh can be rendered by the Firefly renderer. Use THREE.Mesh to draw lines.");
                        m && Ta.bindVertexArrayOES(null)
                    }
                },
                    this.renderBuffer = function(a, b, c, d, e, f) {
                        if (!1 !== d.visible) {
                            Q(f);
                            var g = Y(a, b, c, d, f),
                                h = g.attributes,
                                i = !1,
                                j = d.wireframe ? 1 : 0,
                                k = e.id + "_" + g.id + "_" + j;
                            if (k !== $a && ($a = k, i = !0), i && qb.initAttributes(), !d.morphTargets && h.position >= 0 && i && (Qa.bindBuffer(Qa.ARRAY_BUFFER, e.__webglVertexBuffer), qb.enableAttribute(h.position), Qa.vertexAttribPointer(h.position, 3, Qa.FLOAT, !1, 0, 0)), i) {
                                if (e.__webglCustomAttributesList) for (var l = 0,
                                                                            m = e.__webglCustomAttributesList.length; l < m; l++) {
                                    var n = e.__webglCustomAttributesList[l];
                                    h[n.buffer.belongsToAttribute] >= 0 && (Qa.bindBuffer(Qa.ARRAY_BUFFER, n.buffer), qb.enableAttribute(h[n.buffer.belongsToAttribute]), Qa.vertexAttribPointer(h[n.buffer.belongsToAttribute], n.size, Qa.FLOAT, !1, 0, 0))
                                }
                                h.color >= 0 && (f.geometry.colors.length > 0 || f.geometry.faces.length > 0 ? (Qa.bindBuffer(Qa.ARRAY_BUFFER, e.__webglColorBuffer), qb.enableAttribute(h.color), Qa.vertexAttribPointer(h.color, 3, Qa.FLOAT, !1, 0, 0)) : d.defaultAttributeValues && Qa.vertexAttrib3fv(h.color, d.defaultAttributeValues.color)),
                                h.normal >= 0 && (Qa.bindBuffer(Qa.ARRAY_BUFFER, e.__webglNormalBuffer), qb.enableAttribute(h.normal), Qa.vertexAttribPointer(h.normal, 3, Qa.FLOAT, !1, 0, 0)),
                                h.tangent >= 0 && (Qa.bindBuffer(Qa.ARRAY_BUFFER, e.__webglTangentBuffer), qb.enableAttribute(h.tangent), Qa.vertexAttribPointer(h.tangent, 4, Qa.FLOAT, !1, 0, 0)),
                                h.uv >= 0 && (f.geometry.faceVertexUvs[0] ? (Qa.bindBuffer(Qa.ARRAY_BUFFER, e.__webglUVBuffer), qb.enableAttribute(h.uv), Qa.vertexAttribPointer(h.uv, 2, Qa.FLOAT, !1, 0, 0)) : d.defaultAttributeValues && Qa.vertexAttrib2fv(h.uv, d.defaultAttributeValues.uv)),
                                h.uv2 >= 0 && (f.geometry.faceVertexUvs[1] ? (Qa.bindBuffer(Qa.ARRAY_BUFFER, e.__webglUV2Buffer), qb.enableAttribute(h.uv2), Qa.vertexAttribPointer(h.uv2, 2, Qa.FLOAT, !1, 0, 0)) : d.defaultAttributeValues && Qa.vertexAttrib2fv(h.uv2, d.defaultAttributeValues.uv2)),
                                h.lineDistance >= 0 && (Qa.bindBuffer(Qa.ARRAY_BUFFER, e.__webglLineDistanceBuffer), qb.enableAttribute(h.lineDistance), Qa.vertexAttribPointer(h.lineDistance, 1, Qa.FLOAT, !1, 0, 0))
                            }
                            if (qb.disableUnusedAttributes(), f instanceof THREE.Mesh) {
                                var o = e.__typeArray === Uint32Array ? Qa.UNSIGNED_INT: Qa.UNSIGNED_SHORT;
                                d.wireframe ? (qb.setLineWidth(d.wireframeLinewidth * xa), i && Qa.bindBuffer(Qa.ELEMENT_ARRAY_BUFFER, e.__webglLineBuffer), Qa.drawElements(Qa.LINES, e.__webglLineCount, o, 0)) : (i && Qa.bindBuffer(Qa.ELEMENT_ARRAY_BUFFER, e.__webglFaceBuffer), Qa.drawElements(Qa.TRIANGLES, e.__webglFaceCount, o, 0))
                            } else if (f instanceof THREE.Line) {
                                var p = f.mode === THREE.LineStrip ? Qa.LINE_STRIP: Qa.LINES;
                                qb.setLineWidth(d.linewidth * xa),
                                    Qa.drawArrays(p, 0, e.__webglLineCount)
                            } else f instanceof THREE.PointCloud && Qa.drawArrays(Qa.POINTS, 0, e.__webglPointCount)
                        }
                    },
                    this.render = function(a, b, c, d, e) {
                        if (b instanceof THREE.Camera == !1) return void THREE.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");
                        $a = "",
                            Ya = -1,
                            Za = null,
                        void 0 !== e && (Ja.length = 0, nb = !0);
                        var f = a.fog; ! 0 === a.autoUpdate && a.updateMatrixWorld(),
                        void 0 === b.parent && b.updateMatrixWorld(),
                            b.matrixWorldInverse.getInverse(b.matrixWorld),
                            b.worldUpTransform ? kb.multiplyMatrices(b.worldUpTransform, b.matrixWorld) : kb.copy(b.matrixWorld),
                            jb.multiplyMatrices(b.projectionMatrix, b.matrixWorldInverse),
                            ib.setFromMatrix(jb);
                        var h = a instanceof g && a.renderImmediate;
                        if (h || (Oa.length = 0, Pa.length = 0, D(a, !0 === Ua.sortObjects, !0 === a.forceVisible), !0 === Ua.sortObjects && (Oa.sort(A), Pa.sort(z))), nb && (e && e.length && (Ja = e.slice()), na(Ja)), this.setRenderTarget(c), this.resetGLState(), (this.autoClear || d) && this.clear(this.autoClearColor, this.autoClearDepth, this.autoClearStencil), a.overrideMaterial) {
                            var i = a.overrideMaterial;
                            X(i),
                                h ? J(a, "", b, Ja, f, i) : (F(Oa, b, Ja, f, i), F(Pa, b, Ja, f, i))
                        } else h ? J(a, "", b, Ja, f, null) : (qb.setBlending(THREE.NoBlending), F(Oa, b, Ja, f, null), F(Pa, b, Ja, f, null));
                        c && c.generateMipmaps && c.minFilter !== THREE.NearestFilter && c.minFilter !== THREE.LinearFilter && sa(c),
                            this.resetGLState(),
                            qb.setDepthTest(!0),
                            qb.setDepthWrite(!0)
                    },
                    this.clearBlend = function() {
                        qb.setBlending(THREE.NoBlending)
                    },
                    this.setProgramPrefix = function(a, b, c) {
                        _a = a,
                            ab = b,
                            bb = c
                    },
                    this.getProgramPrefix = function() {
                        return {
                            programPrefix: _a,
                            vertexPrefix: ab,
                            fragmentPrefix: bb
                        }
                    };
                var Sb, Tb, Ub, Vb, Wb = {},
                    Xb = 0,
                    Yb = {
                        MeshDepthMaterial: "depth",
                        MeshNormalMaterial: "normal",
                        MeshBasicMaterial: "firefly_basic",
                        MeshLambertMaterial: "lambert",
                        MeshPhongMaterial: "firefly_phong",
                        LineBasicMaterial: "firefly_basic",
                        LineDashedMaterial: "dashed",
                        PointCloudMaterial: "firefly_basic"
                    };
                this.setFaceCulling = function(a, b) {
                    a === THREE.CullFaceNone ? Qa.disable(Qa.CULL_FACE) : (b === THREE.FrontFaceDirectionCW ? Qa.frontFace(Qa.CW) : Qa.frontFace(Qa.CCW), a === THREE.CullFaceBack ? Qa.cullFace(Qa.BACK) : a === THREE.CullFaceFront ? Qa.cullFace(Qa.FRONT) : Qa.cullFace(Qa.FRONT_AND_BACK), Qa.enable(Qa.CULL_FACE))
                },
                    this.setMaterialFaces = function(a) {
                        qb.setDoubleSided(a.side === THREE.DoubleSide),
                            qb.setFlipSided(a.side === THREE.BackSide)
                    },
                    this.uploadTexture = function(a) {
                        void 0 === a.__webglInit && (a.__webglInit = !0, a.addEventListener("dispose", Kb), a.__webglTexture = Qa.createTexture(), Ua.info.memory.textures++),
                            Qa.bindTexture(Qa.TEXTURE_2D, a.__webglTexture),
                            Qa.pixelStorei(Qa.UNPACK_FLIP_Y_WEBGL, a.flipY),
                            Qa.pixelStorei(Qa.UNPACK_PREMULTIPLY_ALPHA_WEBGL, a.premultiplyAlpha),
                            Qa.pixelStorei(Qa.UNPACK_ALIGNMENT, a.unpackAlignment),
                            a.image = pa(a.image, xb);
                        var b = a.image,
                            c = THREE.Math.isPowerOfTwo(b.width) && THREE.Math.isPowerOfTwo(b.height),
                            e = ua(a.format),
                            f = ua(a.type);
                        oa(Qa.TEXTURE_2D, a, c);
                        var g, h, i, j = a.mipmaps;
                        if (a instanceof THREE.DataTexture) if (j.length > 0 && c) {
                            for (h = 0, i = j.length; h < i; h++) g = j[h],
                                Qa.texImage2D(Qa.TEXTURE_2D, h, e, g.width, g.height, 0, e, f, g.data);
                            a.generateMipmaps = !1
                        } else Qa.texImage2D(Qa.TEXTURE_2D, 0, e, b.width, b.height, 0, e, f, b.data);
                        else if (a instanceof THREE.CompressedTexture) {
                            for (h = 0, i = j.length; h < i; h++) g = j[h],
                                a.format !== THREE.RGBAFormat && a.format !== THREE.RGBFormat ? Eb().indexOf(e) > -1 ? Qa.compressedTexImage2D(Qa.TEXTURE_2D, h, e, g.width, g.height, 0, g.data) : THREE.warn("Attempt to load unsupported compressed texture format") : Qa.texImage2D(Qa.TEXTURE_2D, h, e, g.width, g.height, 0, e, f, g.data);
                            if (j.length > 1 && Eb().indexOf(e) > -1) for (var k, l = g.width >> 1,
                                                                               m = g.height >> 1,
                                                                               n = j.length; l >= 1 || m >= 1;) k = 4 == g.width && 4 == g.height ? g.data: new DataView(g.data.buffer, g.data.byteOffset, g.data.byteLength * (Math.max(l, 4) * Math.max(m, 4)) / (g.width * g.height)),
                                Qa.compressedTexImage2D(Qa.TEXTURE_2D, n, e, Math.max(l, 1), Math.max(m, 1), 0, k),
                                l >>= 1,
                                m >>= 1,
                                ++n
                        } else if (j.length > 0 && c) {
                            for (h = 0, i = j.length; h < i; h++) g = d.rescueFromPolymer(j[h]),
                                Qa.texImage2D(Qa.TEXTURE_2D, h, e, e, f, g);
                            a.generateMipmaps = !1
                        } else Qa.texImage2D(Qa.TEXTURE_2D, 0, e, e, f, d.rescueFromPolymer(a.image));
                        a.generateMipmaps && c && Qa.generateMipmap(Qa.TEXTURE_2D),
                            a.needsUpdate = !1,
                        a.onUpdate && a.onUpdate()
                    },
                    this.setTexture = function(a, b) {
                        Qa.activeTexture(Qa.TEXTURE0 + b),
                            a.needsUpdate ? Ua.uploadTexture(a) : a.__webglTexture && Qa.bindTexture(Qa.TEXTURE_2D, a.__webglTexture)
                    },
                    this.initFrameBufferMRT = function(a, b) {
                        var c = a[0],
                            d = !1;
                        if (c && !c.__webglFramebuffer) {
                            void 0 === c.depthBuffer && (c.depthBuffer = !0),
                            void 0 === c.stencilBuffer && (c.stencilBuffer = !0),
                                c.__webglFramebuffer = Qa.createFramebuffer(),
                                Qa.bindFramebuffer(Qa.FRAMEBUFFER, c.__webglFramebuffer);
                            var e;
                            c.shareDepthFrom ? e = c.__webglRenderbuffer = c.shareDepthFrom.__webglRenderbuffer: c.depthBuffer && !c.stencilBuffer ? (e = c.__webglRenderbuffer = Qa.createRenderbuffer(), Qa.bindRenderbuffer(Qa.RENDERBUFFER, e), Qa.renderbufferStorage(Qa.RENDERBUFFER, Qa.DEPTH_COMPONENT16, c.width, c.height)) : c.depthBuffer && c.stencilBuffer && (e = c.__webglRenderbuffer = Qa.createRenderbuffer(), Qa.bindRenderbuffer(Qa.RENDERBUFFER, e), Qa.renderbufferStorage(Qa.RENDERBUFFER, Qa.DEPTH_STENCIL, c.width, c.height)),
                                c.depthBuffer && !c.stencilBuffer ? Qa.framebufferRenderbuffer(Qa.FRAMEBUFFER, Qa.DEPTH_ATTACHMENT, Qa.RENDERBUFFER, e) : c.depthBuffer && c.stencilBuffer && Qa.framebufferRenderbuffer(Qa.FRAMEBUFFER, Qa.DEPTH_STENCIL_ATTACHMENT, Qa.RENDERBUFFER, e),
                                d = !0
                        }
                        var f = Xa;
                        Qa.bindFramebuffer(Qa.FRAMEBUFFER, c.__webglFramebuffer);
                        var g;
                        for (g = 0; g < a.length; g++) {
                            var h = a[g];
                            if (!h.__webglTexture) {
                                var i = THREE.Math.isPowerOfTwo(h.width) && THREE.Math.isPowerOfTwo(h.height),
                                    j = ua(h.format),
                                    k = ua(h.type);
                                h.addEventListener("dispose", Lb),
                                    h.__webglTexture = Qa.createTexture(),
                                    Ua.info.memory.textures++,
                                    Qa.bindTexture(Qa.TEXTURE_2D, h.__webglTexture),
                                    oa(Qa.TEXTURE_2D, h, i),
                                    Qa.texImage2D(Qa.TEXTURE_2D, 0, j, h.width, h.height, 0, j, k, null),
                                i && h.generateMipmaps && Qa.generateMipmap(Qa.TEXTURE_2D)
                            }
                            Qa.framebufferTexture2D(Qa.FRAMEBUFFER, Qa.COLOR_ATTACHMENT0 + g, Qa.TEXTURE_2D, h.__webglTexture, 0)
                        }
                        if (this.supportsMRT()) {
                            for (var l = Qa.getParameter(Ra.MAX_COLOR_ATTACHMENTS_WEBGL); g < l;) Qa.framebufferTexture2D(Qa.FRAMEBUFFER, Qa.COLOR_ATTACHMENT0 + g, Qa.TEXTURE_2D, null, 0),
                                g++;
                            var m = [Ra.COLOR_ATTACHMENT0_WEBGL];
                            for (g = 1; g < a.length; g++) m.push(Ra.COLOR_ATTACHMENT0_WEBGL + g);
                            Ra.drawBuffersWEBGL(m)
                        }
                        if (b) {
                            var n = Qa.checkFramebufferStatus(Qa.FRAMEBUFFER);
                            n !== Qa.FRAMEBUFFER_COMPLETE && (THREE.log("Can't use multiple render targets. Falling back to two passes. " + n), delete c.__webglFramebuffer, b = !1)
                        }
                        return Qa.bindFramebuffer(Qa.FRAMEBUFFER, f),
                        d && (Qa.bindTexture(Qa.TEXTURE_2D, null), Qa.bindRenderbuffer(Qa.RENDERBUFFER, null), Qa.bindFramebuffer(Qa.FRAMEBUFFER, null)),
                            b
                    },
                    this.setRenderTarget = function(a) {
                        var b;
                        if (Array.isArray(a)) this.initFrameBufferMRT(a),
                            b = a[0];
                        else if (a) {
                            var c = a.__webglFramebuffer;
                            c && Xa === c || this.initFrameBufferMRT([a]),
                                b = a
                        }
                        var d, e, f, g, h;
                        b ? (d = b.__webglFramebuffer, e = b.width, f = b.height, g = 0, h = 0) : (d = null, e = fb, f = gb, g = db, h = eb),
                        d !== Xa && (Qa.bindFramebuffer(Qa.FRAMEBUFFER, d), Qa.viewport(g, h, e, f), Xa = d)
                    },
                    this.verifyMRTWorks = function(a) {
                        return !! this.supportsMRT() && this.initFrameBufferMRT(a, !0)
                    },
                    this.readRenderTargetPixels = function(a, b, c, d, e, f) {
                        if (! (a instanceof THREE.WebGLRenderTarget)) return void THREE.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");
                        if (a.__webglFramebuffer) {
                            if (a.format !== THREE.RGBAFormat && a.format !== THREE.RGBFormat || a.type !== THREE.UnsignedByteType) return void THREE.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not a readable format.");
                            var g = !1;
                            a.__webglFramebuffer !== Xa && (Qa.bindFramebuffer(Qa.FRAMEBUFFER, a.__webglFramebuffer), g = !0),
                                a.canReadPixels || Qa.checkFramebufferStatus(Qa.FRAMEBUFFER) === Qa.FRAMEBUFFER_COMPLETE ? Qa.readPixels(b, c, d, e, Qa.RGBA, Qa.UNSIGNED_BYTE, f) : THREE.error("THREE.WebGLRenderer.readRenderTargetPixels: readPixels from renderTarget failed. Framebuffer not complete."),
                            g && Qa.bindFramebuffer(Qa.FRAMEBUFFER, Xa)
                        }
                    }
            };
        a.exports = h
    },
    function(a, b, c) {
        "use strict";
        var d = c(74),
            e = c(5).resolve,
            f = "undefined" != typeof navigator && !!navigator.userAgent.match(/Trident\/7\./),
            g = ["opaque_luminance_modifier", "surface_albedo", "surface_roughness", "surface_anisotropy", "surface_rotation", "opaque_f0", "opaque_albedo", "metal_f0", "layered_f0", "layered_diffuse", "layered_roughness", "layered_anisotropy", "layered_rotation", "layered_bottom_f0", "layered_fraction", "surface_cutout", "wood_curly_distortion"],
            h = function(a, b, c) {
                var d = "uv_" + a + "_map",
                    e = "";
                return b && c ? e = "if (" + d + ".x < 0.0 || " + d + ".x > 1.0 || " + d + ".y < 0.0 || " + d + ".y > 1.0) { discard; }": b ? e = "if (" + d + ".x < 0.0 || " + d + ".x > 1.0) { discard; }": c && (e = "if (" + d + ".y < 0.0 || " + d + ".y > 1.0) { discard; }"),
                "#define " + a.toUpperCase() + "_CLAMP_TEST " + e
            },
            i = function() {
                var a = 0,
                    b = function(a) {
                        var b, c, d = [];
                        for (var e in a) ! 1 !== (b = a[e]) && (c = "#define " + e + " " + b, d.push(c));
                        return d.join("\n")
                    },
                    c = function(a, b, c) {
                        for (var d = {},
                                 e = 0,
                                 f = c.length; e < f; e++) {
                            var g = c[e];
                            d[g] = a.getUniformLocation(b, g)
                        }
                        return d
                    },
                    i = function(a, b, c) {
                        for (var d = {},
                                 e = 0,
                                 f = c.length; e < f; e++) {
                            var g = c[e];
                            d[g] = a.getAttribLocation(b, g)
                        }
                        return d
                    },
                    j = function(a, b, c, d, e) {
                        var f = d ? "1.0-": "",
                            g = "texture2D(" + a + ", (UV))",
                            h = "";
                        return e = e || "vec4(0.0)",
                            b && c ? h = "((UV).x < 0.0 || (UV).x > 1.0 || (UV).y < 0.0 || (UV).y > 1.0) ? " + e + " : ": b ? h = "((UV).x < 0.0 || (UV).x > 1.0) ? " + e + " : ": c && (h = "((UV).y < 0.0 || (UV).y > 1.0) ? " + e + " : "),
                        "#define GET_" + a.toUpperCase() + "(UV) (" + h + f + g + ")"
                    },
                    k = function(a) {
                        for (var b = "\n",
                                 c = 0; c < g.length; c++) {
                            var d = a[g[c]];
                            d && (b += h(g[c], d.S, d.T) + "\n")
                        }
                        return b
                    };
                return function(g, h, l, m) {
                    var n = g,
                        o = n.context,
                        p = l.defines,
                        q = l.__webglShader.uniforms,
                        r = l.attributes,
                        s = e(l.__webglShader.vertexShader),
                        t = e(l.__webglShader.fragmentShader),
                        u = l.index0AttributeName;
                    void 0 === u && !0 === m.morphTargets && (u = "position");
                    m.envMap;
                    var v, w, x = g.gammaFactor > 0 ? g.gammaFactor: 1,
                        y = b(p),
                        z = o.createProgram();
                    l instanceof THREE.RawShaderMaterial ? (v = "", w = "") : (v = ["precision " + m.precision + " float;", "precision " + m.precision + " int;", y, m.vertexPrefix, m.supportsVertexTextures ? "#define VERTEX_TEXTURES": "", n.gammaInput ? "#define GAMMA_INPUT": "", n.gammaOutput ? "#define GAMMA_OUTPUT": "", "#define GAMMA_FACTOR " + x, m.mrtNormals ? "#define MRT_NORMALS": "", m.mrtIdBuffer ? "#define MRT_ID_BUFFER": "", "#define MAX_DIR_LIGHTS " + m.maxDirLights, "#define MAX_POINT_LIGHTS " + m.maxPointLights, "#define MAX_SPOT_LIGHTS " + m.maxSpotLights, "#define MAX_HEMI_LIGHTS " + m.maxHemiLights, "#define MAX_BONES " + m.maxBones, "#define NUM_CUTPLANES " + m.numCutplanes, m.map ? "#define USE_MAP": "", m.envMap ? "#define USE_ENVMAP": "", m.envMap ? "#define ENVMAP_MODE_REFLECTION": "", m.irradianceMap ? "#define USE_IRRADIANCEMAP": "", m.lightMap ? "#define USE_LIGHTMAP": "", m.bumpMap ? "#define USE_BUMPMAP": "", m.normalMap ? "#define USE_NORMALMAP": "", m.specularMap ? "#define USE_SPECULARMAP": "", m.alphaMap ? "#define USE_ALPHAMAP": "", m.vertexColors ? "#define USE_COLOR": "", m.vertexIds ? "#define USE_VERTEX_ID": "", m.useInstancing ? "#define USE_INSTANCING": "", m.wideLines ? "#define WIDE_LINES": "", m.skinning ? "#define USE_SKINNING": "", m.useVertexTexture ? "#define BONE_TEXTURE": "", m.morphTargets ? "#define USE_MORPHTARGETS": "", m.morphNormals ? "#define USE_MORPHNORMALS": "", m.wrapAround ? "#define WRAP_AROUND": "", m.doubleSided ? "#define DOUBLE_SIDED": "", m.flipSided ? "#define FLIP_SIDED": "", m.sizeAttenuation ? "#define USE_SIZEATTENUATION": "", m.logarithmicDepthBuffer ? "#define USE_LOGDEPTHBUF": "", m.useFragDepthExt ? "#define USE_LOGDEPTHBUF_EXT": "", m.packedNormals ? "#define UNPACK_NORMALS": "", "uniform mat4 modelMatrix;", "uniform mat4 modelViewMatrix;", "uniform mat4 projectionMatrix;", "uniform mat4 viewMatrix;", "uniform mat3 normalMatrix;", "uniform vec3 cameraPosition;", "attribute vec3 position;", "#ifdef UNPACK_NORMALS", "attribute vec2 normal;", "#else", "attribute vec3 normal;", "#endif", "attribute vec2 uv;", "attribute vec2 uv2;", "#ifdef PRISMWOOD", "attribute vec3 uvw;", "#endif", "#ifdef USE_COLOR", "\tattribute vec3 color;", "#endif", ""].join("\n"), w = [m.bumpMap || m.normalMap ? "#extension GL_OES_standard_derivatives : enable": "", !m.mrtIdBuffer && !m.mrtNormals || f ? "": "#extension GL_EXT_draw_buffers : enable", m.mrtIdBuffer ? "#define gl_FragColor gl_FragData[0]": "", m.haveTextureLod ? "#define HAVE_TEXTURE_LOD": "", y, m.fragmentPrefix, "#define MAX_DIR_LIGHTS " + m.maxDirLights, "#define MAX_POINT_LIGHTS " + m.maxPointLights, "#define MAX_SPOT_LIGHTS " + m.maxSpotLights, "#define MAX_HEMI_LIGHTS " + m.maxHemiLights, "#define NUM_CUTPLANES " + m.numCutplanes, m.alphaTest ? "#define ALPHATEST " + m.alphaTest: "", n.gammaInput ? "#define GAMMA_INPUT": "", n.gammaOutput ? "#define GAMMA_OUTPUT": "", "#define GAMMA_FACTOR " + x, m.mrtNormals ? "#define MRT_NORMALS": "", m.mrtIdBuffer ? "#define MRT_ID_BUFFER": "", m.mrtIdBuffer > 1 ? "#define MODEL_COLOR": "", "#define TONEMAP_OUTPUT " + (m.tonemapOutput || 0), m.useFog && m.fog ? "#define USE_FOG": "", m.useFog && m.fogExp ? "#define FOG_EXP2": "", m.map ? "#define USE_MAP": "", m.envMap ? "#define USE_ENVMAP": "", m.envMap ? "#define ENVMAP_TYPE_CUBE": "", m.envMap ? "#define ENVMAP_MODE_REFLECTION": "", m.envMap ? "#define ENVMAP_BLENDING_MULTIPLY": "", m.irradianceMap ? "#define USE_IRRADIANCEMAP": "", m.envGammaEncoded ? "#define ENV_GAMMA": "", m.irrGammaEncoded ? "#define IRR_GAMMA": "", m.envRGBM ? "#define ENV_RGBM": "", m.irrRGBM ? "#define IRR_RGBM": "", m.lightMap ? "#define USE_LIGHTMAP": "", m.bumpMap ? "#define USE_BUMPMAP": "", m.normalMap ? "#define USE_NORMALMAP": "", m.specularMap ? "#define USE_SPECULARMAP": "", m.alphaMap ? "#define USE_ALPHAMAP": "", m.vertexColors ? "#define USE_COLOR": "", m.vertexIds ? "#define USE_VERTEX_ID": "", m.metal ? "#define METAL": "", m.clearcoat ? "#define CLEARCOAT": "", m.wrapAround ? "#define WRAP_AROUND": "", m.doubleSided ? "#define DOUBLE_SIDED": "", m.flipSided ? "#define FLIP_SIDED": "", m.logarithmicDepthBuffer ? "#define USE_LOGDEPTHBUF": "", m.hatchPattern ? "#define HATCH_PATTERN": "", m.mapInvert ? "#define MAP_INVERT": "", j("map", m.mapClampS, m.mapClampT), j("bumpMap", m.bumpMapClampS, m.bumpMapClampT), j("normalMap", m.normalMapClampS, m.normalMapClampT), j("specularMap", m.specularMapClampS, m.specularMapClampT), j("alphaMap", m.alphaMapClampS, m.alphaMapClampT, m.alphaMapInvert), "#ifdef USE_ENVMAP", "#ifdef HAVE_TEXTURE_LOD", "#extension GL_EXT_shader_texture_lod : enable", "#endif", "#endif", "#extension GL_OES_standard_derivatives : enable", "precision " + m.precisionFragment + " float;", "precision " + m.precisionFragment + " int;", "uniform highp mat4 viewMatrix;", "uniform highp mat4 projectionMatrix;", "uniform highp vec3 cameraPosition;", "#if defined(USE_ENVMAP) || defined(USE_IRRADIANCEMAP)", "uniform mat4 viewMatrixInverse;", "#endif", ""].join("\n"), m.isPrism && (w += k(m)));
                    var A = new d(o, o.VERTEX_SHADER, v + s),
                        B = new d(o, o.FRAGMENT_SHADER, w + t);
                    o.attachShader(z, A),
                        o.attachShader(z, B),
                    void 0 !== u && o.bindAttribLocation(z, 0, u),
                        o.linkProgram(z),
                        o.deleteShader(A),
                        o.deleteShader(B);
                    var C = ["viewMatrix", "modelViewMatrix", "projectionMatrix", "normalMatrix", "modelMatrix", "cameraPosition", "viewMatrixInverse", "mvpMatrix", "dbId"];
                    m.logarithmicDepthBuffer && C.push("logDepthBufFC");
                    for (var D in q) C.push(D);
                    this.uniforms = c(o, z, C),
                        C = ["position", "normal", "uv", "uv2", "tangent", "color", "lineDistance", "uvw", "id", "instOffset", "instScaling", "instRotation", "prev", "next", "side"];
                    for (var E in r) C.push(E);
                    return this.attributes = i(o, z, C),
                        this.attributesKeys = Object.keys(this.attributes),
                        this.id = a++,
                        this.code = h,
                        this.usedTimes = 1,
                        this.program = z,
                        this.vertexShader = A,
                        this.fragmentShader = B,
                        this
                }
            } ();
        a.exports = {
            PrismMaps: g,
            GetPrismMapChunk: h,
            WebGLProgram: i
        }
    },
    function(a, b, c) {
        "use strict";
        function d() {
            this.shadowMap = void 0,
                this.shadowMapSize = void 0,
                this.shadowMatrix = void 0,
                this.shadowLightDir = void 0,
                this.init = function(a) {
                    this.shadowMap = a,
                        this.shadowMapSize = new THREE.Vector2(a.width, a.height),
                        this.shadowMatrix = new THREE.Matrix4,
                        this.shadowLightDir = new THREE.Vector3
                },
                this.apply = function(a) {
                    a.shadowMap = this.shadowMap,
                        a.shadowMatrix = this.shadowMatrix,
                        a.shadowLightDir = this.shadowLightDir,
                        this.shadowMap ? (h.setMacro(a, "USE_SHADOWMAP"), o.UseHardShadows && h.setMacro(a, "USE_HARD_SHADOWS")) : (h.removeMacro(a, "USE_SHADOWMAP"), h.removeMacro(a, "USE_HARD_SHADOWS"))
                }
        }
        function e(a) {
            function b(a) {
                var b = new THREE.WebGLRenderTarget(a, a, {
                    minFilter: THREE.LinearFilter,
                    magFilter: THREE.LinearFilter,
                    format: THREE.RGBAFormat,
                    type: THREE.FloatType,
                    stencilBuffer: !1,
                    generateMipmaps: !1
                });
                return b.generateMipmaps = !1,
                    b
            }
            function c(a) {
                x.setRenderTarget(a),
                    x.setClearColor(w, 1),
                    x.clear()
            }
            function e(a) {
                var b = i.shadowMap;
                i.shadowMap = D,
                    a.setShadowParams(i),
                    i.apply(y),
                    i.shadowMap = b
            }
            function f(a) {
                a.uniforms.shadowMapRangeMin.value = u.near,
                    a.uniforms.shadowMapRangeSize.value = u.far - u.near,
                    a.uniforms.shadowESMConstant.value = o.ShadowESMConstant,
                    a.uniforms.shadowMinOpacity.value = o.ShadowMinOpacity
            }
            function g(a, b, c) {
                var d = c || new THREE.Vector3;
                return d.x = 1 & b ? a.max.x: a.min.x,
                    d.y = 2 & b ? a.max.y: a.min.y,
                    d.z = 4 & b ? a.max.z: a.min.z,
                    d
            }
            var i = null,
                t = null,
                u = new THREE.OrthographicCamera,
                v = Math.exp(o.ShadowESMConstant),
                w = o.UseHardShadows ? new THREE.Color(1, 1, 1) : new THREE.Color(v, 1, 1),
                x = a,
                y = null,
                z = null,
                A = null,
                B = h.createShaderMaterial(l),
                C = new n;
            B.getCustomOverrideMaterial = C.getCustomOverrideMaterial;
            var D = null,
                E = function() {
                    var a = new THREE.Matrix4,
                        b = new THREE.Matrix4,
                        c = new THREE.Vector3(0, 0, 0),
                        d = new THREE.Box3,
                        e = new THREE.Vector3,
                        f = new THREE.Vector3;
                    return function(g, h, i) {
                        g.position.copy(i),
                            g.lookAt(c),
                            a.makeRotationFromQuaternion(g.quaternion),
                            b.getInverse(a),
                            d.copy(h).applyMatrix4(b),
                            f = d.center(f),
                            e.set(f.x, f.y, d.max.z),
                            e.applyMatrix4(a),
                            g.position.copy(e),
                            f = d.size(f),
                            g.left = -.5 * f.x,
                            g.right = .5 * f.x,
                            g.bottom = -.5 * f.y,
                            g.top = .5 * f.y,
                            g.near = 0,
                            g.far = f.z,
                            g.updateMatrixWorld(),
                            g.matrixWorldInverse.getInverse(g.matrixWorld),
                            g.updateProjectionMatrix()
                    }
                } ();
            this.init = function() {
                i = new d,
                    i.init(b(o.ShadowMapSize)),
                    t = o.BlurShadowMap ? new k(o.ShadowMapSize, o.ShadowMapSize, o.ShadowMapBlurRadius, 1, {
                        type: i.shadowMap.type,
                        format: i.shadowMap.format
                    }) : void 0,
                    y = h.createShaderMaterial(m),
                    y.depthWrite = !1,
                    y.transparent = !0,
                    z = j.createGroundShape(y),
                    A = new THREE.Scene,
                    A.add(z),
                    this.groundShapeBox = new THREE.Box3,
                    D = b(1),
                    c(D)
            },
                this.init(),
                this.state = p,
                this.startUpdate = function(a, b, c, d, e) {
                    var f = a.getVisibleBounds(!0);
                    return this.beginShadowMapUpdate(c, f, d),
                        a.reset(u, 3, !0),
                        this.state = q,
                        b = this.continueUpdate(a, b, e)
                },
                this.continueUpdate = function(a, b, c) {
                    return b = a.renderSome(this.renderSceneIntoShadowMap, b),
                        a.isDone() ? (this.state = r, this.finishShadowMapUpdate(c)) : e(c),
                        b
                },
                this.beginShadowMapUpdate = function(a, b, d) {
                    E(u, b, d),
                        f(B),
                        C.forEachMaterial(f),
                    o.UseHardShadows && (h.setMacro(B, "USE_HARD_SHADOWS"), C.forEachMaterial(function(a) {
                        h.setMacro(a, "USE_HARD_SHADOWS")
                    })),
                        c(i.shadowMap),
                        this.renderSceneIntoShadowMap(A)
                },
                this.renderSceneIntoShadowMap = function(a) {
                    a.overrideMaterial = B,
                        x.render(a, u, i.shadowMap),
                        a.overrideMaterial = null
                },
                this.finishShadowMapUpdate = function(a) {
                    t && !o.UseHardShadows && t.render(x, i.shadowMap, i.shadowMap),
                        i.shadowMatrix.multiplyMatrices(u.projectionMatrix, u.matrixWorldInverse),
                        i.shadowMapRangeMin = u.near,
                        i.shadowMapRangeSize = u.far - u.near,
                        i.shadowLightDir.copy(u.position).normalize(),
                        a.setShadowParams(i),
                        i.apply(y),
                        this.isValid = !0
                },
                this.cleanup = function(a) {
                    t && t.cleanup(),
                    i.shadowMap && i.shadowMap.dispose(),
                        a.setShadowParams(s),
                        B.dispose(),
                        C.dispose(),
                        y.dispose(),
                        z.geometry.dispose()
                },
                this.setGroundShadowTransform = function() {
                    return function(a, b, c, d) {
                        j.setGroundShapeTransform(z, a, b, c, d),
                            this.groundShapeBox.setFromObject(z)
                    }
                } (),
                this.renderGroundShadow = function(a, b) {
                    x.render(A, a, b, !1)
                },
                this.expandByGroundShadow = function() {
                    var a = new THREE.Plane,
                        b = new THREE.Ray,
                        c = new THREE.Vector3,
                        d = new THREE.Vector3,
                        e = new THREE.Box3;
                    return function(f, h) {
                        a.normal.set(0, 1, 0),
                            a.constant = -f.min.y,
                            b.direction.copy(h).negate().normalize();
                        var i = f.center(c),
                            j = 100 * i.distanceToSquared(f.min) * 100;
                        e.makeEmpty();
                        for (var k = 0; k < 8; k++) {
                            b.origin = g(f, k);
                            var l = b.intersectPlane(a, d);
                            l && (l.distanceToSquared(i) >= j || e.expandByPoint(l))
                        }
                        f.union(e)
                    }
                } (),
                this.getShadowParams = function() {
                    return i
                },
                this.getShadowCamera = function() {
                    return u
                }
        }
        function f() {}
        var g = c(5),
            h = c(66),
            i = c(91),
            j = c(97),
            k = c(67),
            l = {
                uniforms: THREE.UniformsUtils.merge([g.ShadowMapCommonUniforms, {
                    shadowMapRangeMin: {
                        type: "f",
                        value: 0
                    },
                    shadowMapRangeSize: {
                        type: "f",
                        value: 0
                    },
                    shadowMinOpacity: {
                        type: "f",
                        value: 0
                    },
                    map: {
                        type: "t",
                        value: null
                    },
                    alphaMap: {
                        type: "t",
                        value: null
                    },
                    texMatrix: {
                        type: "m3",
                        value: new THREE.Matrix3
                    },
                    texMatrixAlpha: {
                        type: "m3",
                        value: new THREE.Matrix3
                    }
                },
                    i.GetPrismMapUniforms("surface_cutout_map")]),
                vertexShader: c(106),
                fragmentShader: c(107)
            },
            m = {
                uniforms: g.ShadowMapUniforms,
                vertexShader: c(108),
                fragmentShader: c(109)
            },
            n = function() {
                function a() {
                    this.init = function() {
                        this.isPrism = !1,
                            this.alphaMap = !1,
                            this.alphaClampS = !1,
                            this.alphaClampT = !1,
                            this.alphaInvert = !1,
                            this.rgbaMap = !1,
                            this.rgbaClampS = !1,
                            this.rgbaClampT = !1,
                            this.rgbaInvert = !1,
                            this.instanced = !1,
                            this.decalIndex = -1
                    },
                        this.init(),
                        this.getMaterialIndex = function() {
                            return (this.isPrism ? 1 : 0) | (this.alphaMap ? 2 : 0) | (this.alphaClampS ? 4 : 0) | (this.alphaClampT ? 8 : 0) | (this.alphaInvert ? 16 : 0) | (this.rgbaMap ? 32 : 0) | (this.rgbaClampS ? 64 : 0) | (this.rgbaClampT ? 128 : 0) | (this.rgbaInvert ? 256 : 0) | (this.instanced ? 512 : 0) | 1024 * (this.decalIndex + 1)
                        }
                }
                function b(a, b) {
                    var c = a.getMaterialIndex();
                    if (!e[c]) {
                        var d = f.clone();
                        a.isPrism && a.alphaMap && (h.setMacro(d, "USE_SURFACE_CUTOUT_MAP"), d.fragmentShader = i.GetPrismMapChunk("surface_cutout", a.alphaClampS, a.alphaClampT) + "\n" + d.fragmentShader),
                        a.instanced && (d.useInstancing = !0),
                            e[c] = d
                    }
                    return e[c]
                }
                function c(a) {
                    return a instanceof THREE.MeshPhongMaterial ? a.opacity < o.ShadowMinOpacity: a.isPrismMaterial ? "PrismTransparent" === a.prismType: !a.visible
                }
                function d(a, d) {
                    if (c(a)) return g;
                    var e = a instanceof THREE.MeshPhongMaterial,
                        f = a.isPrismMaterial;
                    if (!e && !f) return null;
                    var h = e ? a.alphaMap: a.surface_cutout_map,
                        i = e && a.alphaTest ? a.map: null;
                    if (!h && !i && !a.useInstancing) return null;
                    var j = k;
                    j.init(),
                        j.isPrism = f,
                        j.alphaMap = !!h,
                        j.rgbaMap = !!i,
                        j.instanced = a.useInstancing,
                        j.decalIndex = void 0 === d ? -1 : d,
                    h && (j.alphaClampS = h.clampS, j.alphaClampT = h.clampT, j.alphaInvert = h.invert),
                    i && (j.rgbaClampS = i.clampS, j.rgbaClampT = i.clampT, j.rgbaInvert = i.invert);
                    var l = b(j, d);
                    return h && (e ? (l.uniforms.alphaMap.value = h, l.uniforms.texMatrixAlpha.value = h.matrix, l.alphaMap = h, l.side = a.side) : (l.uniforms.surface_cutout_map.value = h, l.uniforms.surface_cutout_map_texMatrix.value.copy(h.matrix), l.uniforms.surface_cutout_map_invert.value = h.invert, l.side = THREE.DoubleSide)),
                    i && (l.uniforms.map.value = i, l.uniforms.texMatrix.value = i.matrix, l.map = i),
                        l
                }
                var e = [],
                    f = h.createShaderMaterial(l),
                    g = new THREE.Material;
                g.visible = !1;
                var j = [],
                    k = new a;
                this.forEachMaterial = function(a) {
                    for (var b = 0; b < e.length; b++) {
                        var c = e[b];
                        c && a(c)
                    }
                    a(f)
                },
                    this.getCustomOverrideMaterial = function(a) {
                        var b = d(a);
                        if (!b) return null;
                        if (!a.decals) return b.decals = null,
                            b;
                        if (a.decals) {
                            j.length = 0;
                            for (var c = 0; c < a.decals.length; c++) {
                                var e = a.decals[c],
                                    f = d(e.material, c);
                                if (!f) return null;
                                j.push({
                                    uv: e.uv,
                                    material: f
                                })
                            }
                        }
                        return b.decals = j,
                            b
                    },
                    this.dispose = function() {
                        this.forEachMaterial(function(a) {
                            a.dispose()
                        })
                    }
            },
            o = {
                ShadowMapSize: 1024,
                ShadowESMConstant: 80,
                ShadowBias: .001,
                ShadowDarkness: .7,
                ShadowMapBlurRadius: 4,
                ShadowMinOpacity: .9,
                UseHardShadows: !1,
                BlurShadowMap: !0
            },
            p = 0,
            q = 1,
            r = 2,
            s = new d;
        f.RefreshUniformsShadow = function(a, b) {
            a.shadowMap && (a.shadowMap.value = b.shadowMap),
            a.shadowMatrix && (a.shadowMatrix.value = b.shadowMatrix),
            a.shadowLightDir && (a.shadowLightDir.value = b.shadowLightDir),
            a.shadowESMConstant && (a.shadowESMConstant.value = o.ShadowESMConstant),
            a.shadowBias && (a.shadowBias.value = o.ShadowBias),
            a.shadowMapSize && (a.shadowMapSize.value = o.ShadowMapSize),
            a.shadowDarkness && (a.shadowDarkness.value = o.ShadowDarkness)
        },
            a.exports = {
                ShadowMapShader: l,
                GroundShadowShader: m,
                ShadowMapOverrideMaterials: n,
                SHADOWMAP_NEEDS_UPDATE: 0,
                SHADOWMAP_INCOMPLETE: 1,
                SHADOWMAP_VALID: 2,
                ShadowConfig: o,
                ShadowRender: f,
                ShadowMaps: e
            }
    },
    function(a, b, c) {
        "use strict";
        function d(a) {
            var b = new THREE.PlaneBufferGeometry(1, 1);
            if (b.attributes.index.array.reverse) b.attributes.index.array.reverse();
            else for (var c, d = b.attributes.index.array,
                          e = Math.floor(d.length / 2), f = 0, g = d.length; f < e; ++f) c = d[f],
                d[f] = d[g - 1 - f],
                d[g - 1 - f] = c;
            return new THREE.Mesh(b, a)
        }
        var e = c(71),
            f = c(66),
            g = c(65),
            h = {
                uniforms: {
                    cutplanes: {
                        type: "v4v",
                        value: []
                    }
                },
                vertexShader: c(98),
                fragmentShader: c(99)
            },
            i = {
                uniforms: {
                    tDepth: {
                        type: "t",
                        value: null
                    },
                    worldSize: {
                        type: "v3",
                        value: new THREE.Vector3(1, 1, 1)
                    }
                },
                defines: {},
                vertexShader: c(100),
                fragmentShader: c(101)
            },
            j = {
                uniforms: {
                    tDepth: {
                        type: "t",
                        value: null
                    }
                },
                defines: {},
                vertexShader: c(102),
                fragmentShader: c(103)
            },
            k = {
                uniforms: {
                    tDepth: {
                        type: "t",
                        value: null
                    },
                    uShadowColor: {
                        type: "v4",
                        value: new THREE.Vector4(0, 0, 0, 1)
                    }
                },
                vertexShader: c(104),
                fragmentShader: c(105)
            },
            l = function() {
                var a, b, c;
                return function(d, e, f, g, h) {
                    a || (a = new THREE.Matrix4),
                    b || (b = new THREE.Vector3),
                    c || (c = new THREE.Vector3),
                        b.subVectors(e, g),
                        a.lookAt(b, e, h),
                        c.copy(g).multiplyScalar( - .5 * f.y).add(e),
                        d.position.copy(c),
                        d.rotation.setFromRotationMatrix(a),
                        d.scale.set(f.z, f.x, f.y)
                }
            } (),
            m = function(a, b) {
                var c, m, n, o, p, q, r, s, t, u, v, w = a,
                    x = !1,
                    y = !0;
                console.log(" GROUND SHADOW TURNED ON");
                var z = e.GROUND_FINISHED,
                    A = {
                        texSize: 64,
                        pixScale: 1,
                        blurRadius: 7,
                        debug: !1
                    };
                if (this.setTransform = function() {
                        var a = new THREE.Vector3(0, 0, 0),
                            b = new THREE.Vector3(0, 0, 0),
                            d = new THREE.Vector3(0, 0, 0),
                            e = new THREE.Vector3(0, 0, 0);
                        return function(f, g, h, i) {
                            f.equals(a) && g.equals(b) && h.equals(d) && i.equals(e) || (a.copy(f), b.copy(g), d.copy(h), e.copy(i), this.setDirty(), c.left = -g.z / 2, c.right = g.z / 2, c.top = g.x / 2, c.bottom = -g.x / 2, c.near = 1, c.far = g.y + c.near, c.updateProjectionMatrix(), l(n, f, g, h, i), c.position.addVectors(f, h.clone().multiplyScalar( - g.y / 2 - c.near)), i && c.up.set(i.x, i.y, i.z), c.lookAt(f), A.debug && (v.position.set(f.x, f.y, f.z), v.rotation.set(c.rotation.x, c.rotation.y, c.rotation.z), v.scale.set(g.z, g.x, g.y)), u.uniforms.worldSize.value.copy(g))
                        }
                    } (), this.renderIntoShadow = function(a) {
                        if (!a.overrideMaterial || !a.overrideMaterial.transparent) {
                            var b = a.overrideMaterial;
                            a.overrideMaterial = q,
                                w.render(a, c, o, !1),
                                a.overrideMaterial = b
                        }
                    },
                        this.prepareGroundShadow = function() {
                            var a, b = 0,
                                c = 0,
                                d = 0;
                            return function(f, g, h, i) {
                                if (!this.enabled || f.isEmpty()) return z = e.GROUND_FINISHED,
                                    h;
                                if (a != f.getGeomScenes() && (y = !0), y) this.clear(),
                                    y = !1,
                                    a = f.getGeomScenes(),
                                    b = a.length,
                                    c = 0,
                                    d = g ? Math.max(Math.ceil(b / 100), g) : b;
                                else {
                                    if (this.isValid()) return z = e.GROUND_FINISHED,
                                        h;
                                    0 === g && (d = b)
                                }
                                var j, k;
                                h && (j = performance.now(), i = void 0 === i ? 1 : i, k = i * h);
                                for (var l, m = 0; m < d && c < b;) {
                                    var n = a[c++];
                                    if (n && (m++, n.forceVisible = !0, this.renderIntoShadow(n), n.forceVisible = !1, h)) {
                                        var o = performance.now() - j;
                                        if (k < o) {
                                            z = e.GROUND_UNFINISHED,
                                                l = h - o;
                                            break
                                        }
                                    }
                                }
                                return c < b && (z = e.GROUND_UNFINISHED, l = h ? h - performance.now() + j: 1),
                                    void 0 !== l ? l: (this.postprocess(), z = e.GROUND_RENDERED, h ? h - performance.now() + j: 1)
                            }
                        } (), this.renderShadow = function(a, b) {
                        x && (b ? w.render(m, a, b, !1) : w.render(m, a))
                    },
                        this.postprocess = function() {
                            t.render(w, p, o),
                                s.render(w, o, p),
                                x = !0
                        },
                        this.clear = function() {
                            var a = w.getClearColor().getHex(),
                                b = w.getClearAlpha();
                            w.setClearColor(0, 0),
                                w.clearTarget(o, !0, !0, !1),
                                w.setClearColor(a, b),
                                w.clearBlend(),
                                x = !1
                        },
                        this.setColor = function(a) {
                            r.uniforms.uShadowColor.value.x = a.r,
                                r.uniforms.uShadowColor.value.y = a.g,
                                r.uniforms.uShadowColor.value.z = a.b
                        },
                        this.getColor = function() {
                            return new THREE.Color(r.uniforms.uShadowColor.value.x, r.uniforms.uShadowColor.value.y, r.uniforms.uShadowColor.value.z)
                        },
                        this.setAlpha = function(a) {
                            r.uniforms.uShadowColor.value.w = a
                        },
                        this.getAlpha = function() {
                            return r.uniforms.uShadowColor.value.w
                        },
                        this.isValid = function() {
                            return x
                        },
                        this.getStatus = function() {
                            return z
                        },
                        this.setDirty = function() {
                            y = !0,
                                z = e.GROUND_UNFINISHED
                        },
                        this.getDepthMaterial = function() {
                            return q
                        },
                        b) for (var B in A) A[B] = b[B] || A[B];
                m = new THREE.Scene,
                    c = new THREE.OrthographicCamera,
                    o = new THREE.WebGLRenderTarget(A.texSize, A.texSize, {
                        minFilter: THREE.LinearFilter,
                        magFilter: THREE.LinearFilter,
                        format: THREE.RGBAFormat,
                        stencilBuffer: !1
                    }),
                    o.generateMipmaps = !1,
                    p = new THREE.WebGLRenderTarget(A.texSize, A.texSize, {
                        minFilter: THREE.LinearFilter,
                        magFilter: THREE.LinearFilter,
                        format: THREE.RGBAFormat,
                        stencilBuffer: !1
                    }),
                    p.generateMipmaps = !1,
                    q = f.createShaderMaterial(h),
                    q.side = THREE.DoubleSide,
                    q.blending = THREE.NoBlending,
                    s = new g(j, "tDepth"),
                    t = new g(j, "tDepth"),
                    u = new g(i, "tDepth"),
                    s.material.defines.KERNEL_SCALE = t.material.defines.KERNEL_SCALE = (A.pixScale / A.texSize).toFixed(4),
                    s.material.defines.KERNEL_RADIUS = t.material.defines.KERNEL_RADIUS = A.blurRadius.toFixed(2),
                    u.material.blending = s.material.blending = t.material.blending = THREE.NoBlending,
                    u.material.depthWrite = s.material.depthWrite = t.material.depthWrite = !1,
                    u.material.depthTest = s.material.depthTest = t.material.depthTest = !1,
                    s.material.defines.HORIZONTAL = 1,
                    r = f.createShaderMaterial(k),
                    r.uniforms.tDepth.value = o,
                    r.depthWrite = !1,
                    r.transparent = !0,
                    n = d(r),
                    m.add(n),
                A.debug && (v = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({
                    color: 65280,
                    wireframe: !0
                })), m.add(v)),
                    this.setTransform(new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 1, 1), new THREE.Vector3(0, 1, 0), THREE.Object3D.DefaultUp)
            };
        m.prototype.constructor = m,
            a.exports = {
                GroundShadow: m,
                createGroundShape: d,
                setGroundShapeTransform: l
            }
    },
    function(a, b) {
        a.exports = "#ifdef USE_LOGDEPTHBUF\r\n#ifdef USE_LOGDEPTHBUF_EXT\r\nvarying float vFragDepth;\r\n#endif\r\nuniform float logDepthBufFC;\r\n#endif\r\n\r\n#if NUM_CUTPLANES > 0\r\nvarying vec3 vWorldPosition;\r\n#endif\r\n\r\nvoid main() {\r\n    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );;\r\n\r\n#if NUM_CUTPLANES > 0\r\n    vec4 worldPosition = modelMatrix * vec4( position, 1.0 );\r\n    vWorldPosition = worldPosition.xyz;\r\n#endif\r\n\r\n#ifdef USE_LOGDEPTHBUF\r\n    gl_Position.z = log2(max(1e-6, gl_Position.w + 1.0)) * logDepthBufFC;\r\n#ifdef USE_LOGDEPTHBUF_EXT\r\n    vFragDepth = 1.0 + gl_Position.w;\r\n#else\r\n    gl_Position.z = (gl_Position.z - 1.0) * gl_Position.w;\r\n#endif\r\n#endif\r\n}\r\n"
    },
    function(a, b) {
        a.exports = "#ifdef USE_LOGDEPTHBUF\r\nuniform float logDepthBufFC;\r\n#ifdef USE_LOGDEPTHBUF_EXT\r\n#extension GL_EXT_frag_depth : enable\r\nvarying float vFragDepth;\r\n#endif\r\n#endif\r\n\r\n#include<pack_depth>\r\n\r\n#if NUM_CUTPLANES > 0\r\nvarying vec3 vWorldPosition;\r\n#endif\r\n#include<cutplanes>\r\n\r\nvoid main() {\r\n#if NUM_CUTPLANES > 0\r\n    checkCutPlanes(vWorldPosition);\r\n#endif\r\n\r\n#if defined(USE_LOGDEPTHBUF) && defined(USE_LOGDEPTHBUF_EXT)\r\n    gl_FragDepthEXT = log2(vFragDepth) * logDepthBufFC * 0.5;\r\n#endif\r\n\r\n#ifdef USE_LOGDEPTHBUF_EXT\r\n    float depth = gl_FragDepthEXT / gl_FragCoord.w;\r\n#else\r\n    float depth = gl_FragCoord.z / gl_FragCoord.w;\r\n#endif\r\n    depth = 1.0 - depth;\r\n    gl_FragColor = packDepth(depth);\r\n}\r\n"
    },
    function(a, b) {
        a.exports = "varying vec2 vUv;\r\n\r\nvoid main() {\r\n    vUv = vec2(uv.x, uv.y);\r\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\r\n}\r\n"
    },
    function(a, b) {
        a.exports = "#define NUM_SAMPLES 29.0\r\n#define NUM_SPIRAL_TURNS 7.0\r\n\r\nuniform sampler2D tDepth;\r\nuniform vec3 worldSize;\r\n\r\nvarying vec2 vUv;\r\n\r\n\r\n\r\n#ifdef PRESET_2\r\n#define SAMPLE_RADIUS 0.3\r\n#define AO_GAMMA 1.0\r\n#define AO_INTENSITY 1.0\r\n#else\r\n#define SAMPLE_RADIUS 0.2\r\n#define AO_GAMMA 3.0\r\n#define AO_INTENSITY 0.8\r\n#endif\r\n\r\n#include<pack_depth>\r\n\r\n#define PI 3.14159265358979\r\n\r\nfloat rand(vec2 co) {\r\n    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);\r\n}\r\n\r\nfloat getRandomAngle(vec2 pos) {\r\n    return rand(pos) * (2.0 * PI);\r\n}\r\n\r\n\r\nvec2 tapLocation(float sampleNumber, float spinAngle, out float ssR){\r\n\r\n    float alpha = float(sampleNumber + 0.5) * (1.0 / NUM_SAMPLES);\r\n    float angle = alpha * (NUM_SPIRAL_TURNS * PI * 2.0) + spinAngle;\r\n\r\n    ssR = alpha;\r\n    return vec2(cos(angle), sin(angle));\r\n}\r\n\r\n\r\nvec2 sampleAO(vec2 unitDirection, float radius) {\r\n    vec2 sampleOffset = unitDirection * radius;\r\n    float idepth = unpackDepth(texture2D(tDepth, vUv + sampleOffset));\r\n    float depth = 1.0 - idepth;\r\n\r\n    if (depth < 1e-6) {\r\n        if (radius == 0.0)\r\n            return vec2(1.0, 1.0);\r\n        else\r\n            return vec2(0.0, 1.0);\r\n    }\r\n\r\n\r\n    vec3 dir = vec3(sampleOffset.x, depth, sampleOffset.y) * worldSize;\r\n    float distance2 = dot(dir,dir);\r\n    float idistance = 1.0 / sqrt(distance2);\r\n\r\n\r\n    vec3 ndir = dir * idistance;\r\n\r\n\r\n\r\n#ifdef PRESET_2\r\n    float importance = ndir.y * idistance;\r\n#else\r\n    float importance = ndir.y / distance2;\r\n#endif\r\n\r\n    vec2 ret;\r\n    ret.x = (idepth == 0.0) ? 0.0 : importance;\r\n    ret.y = importance;\r\n    return ret;\r\n}\r\n\r\nvoid main() {\r\n    vec2 sum = vec2(0.0);\r\n    float angle = getRandomAngle(vUv);\r\n\r\n\r\n    for (float i = 0.0; i<NUM_SAMPLES; i+= 1.0) {\r\n        float ssR;\r\n        vec2 uv = tapLocation(i, angle, ssR);\r\n        sum += sampleAO(uv, ssR * SAMPLE_RADIUS);\r\n    }\r\n    float ao = sum.x / sum.y;\r\n    gl_FragColor = packDepth(AO_INTENSITY * clamp(pow(ao, AO_GAMMA), 0.0, 0.9999));\r\n}\r\n"
    },
    function(a, b) {
        a.exports = "varying vec2 vUv;\r\n\r\nvoid main() {\r\n    vUv = vec2(uv.x, uv.y);\r\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\r\n}\r\n"
    },
    function(a, b) {
        a.exports = "uniform sampler2D tDepth;\r\n\r\nvarying vec2 vUv;\r\n\r\n#ifdef HORIZONTAL\r\n#define GET_UV(X) vec2(vUv.x + KERNEL_SCALE*(X), vUv.y)\r\n#else\r\n#define GET_UV(Y) vec2(vUv.x, vUv.y + KERNEL_SCALE*(Y))\r\n#endif\r\n\r\n#include<pack_depth>\r\n\r\n#define PI 3.14159265358979\r\n#define SIGMA ((2.0 * KERNEL_RADIUS+1.0) / 6.0)\r\n#define SIGMASQ2 (2.0 * SIGMA * SIGMA)\r\n#ifdef BOX\r\n#define KERNEL_VAL(X) 1.0\r\n#else\r\n#define KERNEL_VAL(X) ( (1.0 / sqrt(PI * SIGMASQ2)) * exp(-(X)*(X)/SIGMASQ2) )\r\n#endif\r\n\r\nvoid main() {\r\n    float depthVal = 0.0;\r\n    float sum = 0.0;\r\n    for (float x=-KERNEL_RADIUS; x<=KERNEL_RADIUS; x+=1.0) {\r\n        depthVal += unpackDepth(texture2D(tDepth, GET_UV(x))) * KERNEL_VAL(x);\r\n        sum += KERNEL_VAL(x);\r\n    }\r\n    gl_FragColor = packDepth(depthVal/sum);\r\n}\r\n"
    },
    function(a, b) {
        a.exports = "varying vec2 vUv;\r\n\r\nvoid main() {\r\n    vUv = vec2(uv.x, uv.y);\r\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\r\n}\r\n"
    },
    function(a, b) {
        a.exports = "uniform sampler2D tDepth;\r\nuniform vec4 uShadowColor;\r\nvarying vec2 vUv;\r\n\r\n#include<pack_depth>\r\n\r\nvoid main() {\r\n    float depthVal = unpackDepth(texture2D(tDepth, vUv));\r\n\r\n    gl_FragColor = vec4(uShadowColor.rgb, uShadowColor.a * depthVal);\r\n}\r\n"
    },
    function(a, b) {
        a.exports = "#include<shadowmap_decl_common>\nvarying float depth;\n#ifdef USE_SURFACE_CUTOUT_MAP\nvarying vec2 vUv;\n#else\n#ifdef USE_MAP\nvarying vec2 vUv;\nuniform mat3 texMatrix;\n#endif\n#ifdef USE_ALPHAMAP\nvarying vec2 vUvAlpha;\nuniform mat3 texMatrixAlpha;\n#endif\n#endif\nvoid passCutoutUVCoords() {\n#ifdef USE_SURFACE_CUTOUT_MAP\n    vUv = uv;\n#else\n#ifdef USE_MAP\n    vUv = (texMatrix * vec3(uv, 1.0)).xy;\n#endif\n#ifdef USE_ALPHAMAP\n    vUvAlpha = (texMatrixAlpha * vec3(uv, 1.0)).xy;\n#endif\n#endif\n}\nvoid main() {\n    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n    vec4 p_Position = projectionMatrix * mvPosition;\n    gl_Position = p_Position;\n    depth = -mvPosition.z;\n    passCutoutUVCoords();\n}\n"
    },
    function(a, b) {
        a.exports = "#include<shadowmap_decl_common>\nvarying float depth;\n#ifdef USE_SURFACE_CUTOUT_MAP\n#include<float3_average>\n#prism_uniforms<surface_cutout_map>\nvarying vec2 vUv;\n#else\n#ifdef USE_MAP\nvarying vec2 vUv;\nuniform sampler2D map;\n#endif\n#ifdef USE_ALPHAMAP\nvarying vec2 vUvAlpha;\nuniform sampler2D alphaMap;\n#endif\n#endif\nuniform float shadowMinOpacity;\nvoid applyCutoutMaps() {\n    float opacity = 1.0;\n#ifdef USE_SURFACE_CUTOUT_MAP\n#prism_sample_texture<surface_cutout, opacity, true, false>\n#else\n#ifdef USE_MAP\n    opacity *= GET_MAP(vUv).a;\n#endif\n#ifdef USE_ALPHAMAP\n    opacity *= GET_ALPHAMAP(vUvAlpha).r;\n#endif\n#endif\n#if defined(USE_SURFACE_CUTOUT_MAP) || defined(USE_MAP) || defined(USE_ALPHAMAP)\n    if (opacity < shadowMinOpacity) discard;\n#endif\n}\nvoid main() {\n    float normalizedLinearDepth = (depth - shadowMapRangeMin) / shadowMapRangeSize;\n    float val = exp(shadowESMConstant * normalizedLinearDepth);\n#ifdef USE_HARD_SHADOWS\n    val = normalizedLinearDepth;\n#endif\n    applyCutoutMaps();\n    gl_FragColor = vec4(val, 0, 0, 1);\n}\n"
    },
    function(a, b) {
        a.exports = "#include<shadowmap_decl_vert>\nvoid main() {\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n#include<shadowmap_vert>\n}\n"
    },
    function(a, b) {
        a.exports = "#include<shadowmap_decl_frag>\nvoid main() {\n    float shadowIntensity = 0.5 * (1.0 - getShadowValue());\n    gl_FragColor = vec4(0.0, 0.0, 0.0, shadowIntensity);\n}\n"
    },
    function(a, b, c) {
        "use strict";
        function d(a) {
            function b(a) {
                return a.matrix.elements[2] + a.matrix.elements[12]
            }
            for (var c, d = a.getFragmentList(), i = a, j = i.is2d() && !d.onDemandLoadingEnabled(), k = d.getCount(), l = 0, m = [new Int32Array(k)], n = [], o = 0, p = !1, q = 0; q < k; q++) m[0][q] = q,
                n[q] = q;
            this.renderVizBuffer = function(a) {
                if (i.isvizCacheEnabled) {
                    for (var b = i.renderVizBufferCallback(), d = {},
                             e = b.width * b.height, f = b.buffer, g = 0; g < e; g++) {
                        var h = f[4 * g + 2] << 16 | f[4 * g + 1] << 8 | f[4 * g];
                        16777215 != h && (d[h] = d[h] ? d[h] + 1 : 1)
                    }
                    c = Object.keys(d).sort(function(a, b) {
                        return d[b] - d[a]
                    }).map(Number)
                }
            },
                this.weightAndSort = function() {
                    if (c) {
                        var a = [],
                            b = i.getInstanceTree();
                        if (b) {
                            for (var d = 0; d < c.length; d++) b.enumNodeFragments(c[d],
                                function(b) {
                                    a.push(b)
                                },
                                !1);
                            m[0] = a.concat(n.filter(function(b) {
                                return a.indexOf(b) < 0
                            }))
                        }
                    }
                };
            var r = h;
            a.is2d() && (r /= 6),
            e.isMobileDevice() && (r /= 3, a.is2d() && (r /= 2)),
                r = Math.floor(r);
            var s = r > 0 ? r: h,
                t = Math.floor((k + s - 1) / s),
                u = d.onDemandLoadingEnabled(),
                v = u ? g: f,
                w = new Array(t);
            for (q = 0; q < t; q++) {
                var x = q * s,
                    y = w[q] = new v(d, m, x, s),
                    z = x + s;
                z > k && (z = k),
                    y.lastItem = z,
                u && y.calculateBounds()
            }
            this.addFragment = function(a) {
                if (m[0].length <= a) {
                    var b = 2 * m[0].length;
                    b <= a && (b = a + 1);
                    var c = new Int32Array(b);
                    c.set(m[0]),
                        m[0] = c,
                        this.visibleBoundsDirty = !0
                }
                m[0][a] = a;
                var e = Math.floor(a / s);
                if (w) {
                    var f = w[e];
                    f || (w[e] = f = new v(d, m, e * s, s)),
                    f && f.onFragmentAdded(a)
                }
            },
                this.getFragmentCount = function() {
                    if (!w) return 0;
                    for (var a = w[w.length - 1].lastItem; --a >= 0 && !(d.geomids[a] >= 0););
                    return a + 1
                },
                this.reset = function(a, c) {
                    o != b(c) && (p = !0),
                        o = b(c),
                        l = 0,
                    j && w[0] && (w[0].drawEnd = 0)
                },
                this.getSceneCount = function() {
                    return w.length
                },
                this.getGeomScenes = function() {
                    return w
                },
                this.done = function() {
                    if (j && !i.isLoadDone()) return ! 1;
                    var a;
                    return l >= w.length - 1 && (!(a = w[l]) || a.drawStart >= a.lastItem)
                },
                this.nextBatch = function() {
                    if (i.isvizCacheEnabled && p && (200 == l || l >= this.getSceneCount()) && (p = !1, this.renderVizBuffer(), this.weightAndSort()), l >= this.getSceneCount()) return null;
                    var a = w[l];
                    if (j) {
                        if (a.lastItem >= a.start + a.count && (++l, w[l] && (w[l].drawEnd = w[l].start)), a.drawStart = a.drawEnd, a.drawEnd = a.lastItem, a.hasOwnProperty("drawStart") && a.lastItem <= a.drawStart) return null
                    } else++l;
                    return a.renderImportance = 0,
                        a
                },
                this.getVisibleBounds = function(a, b) {
                    for (var c = this.getSceneCount(), d = 0; d < c; d++) w[d].calculateBounds(),
                        a.union(w[d].boundingBox),
                        b.union(w[d].boundingBox),
                        b.union(w[d].boundingBoxHidden)
                },
                this.rayCast = function(a, b, c) {
                    for (var d = this.getSceneCount(), e = 0; e < d; e++) w[e].raycast(a, b, c)
                }
        }
        var e = c(71),
            f = c(82),
            g = c(111),
            h = 1e3;
        a.exports = d
    },
    function(a, b, c) {
        "use strict";
        function d(a, b, c, d) {
            f.call(this, a, b, c, d),
                this.visibleStats = 0
        }
        var e = c(71),
            f = c(82),
            g = c(83);
        d.prototype = Object.create(f.prototype),
            d.prototype.constructor = d,
            d.prototype.resetVisStatus = function() {
                this.visibleStats = 0
            },
            d.prototype.forEach = function(a, b, c) {
                for (var d = this.getIndices(), f = this.frags, g = !this.sortByShaderDone, h = f.pageOutGeometryEnabled(), i = f.onDemandLoadingEnabled(), j = this.start, k = this.lastItem; j < k; j++) {
                    var l = d ? d[j] : j,
                        m = f.getVizmesh(l, this.renderImportance, !0);
                    if (!g || m && m.material && m.material.program && !m.geometry_proxy || (g = !1), i) {
                        if (f.isFlagSet(l, e.MESH_TRAVERSED) && b == e.MESH_RENDERFLAG) continue;
                        if (!c && b && f.isFlagSet(l, b) && (m.geometry || (m.geometry = f.requireGeometry(l), l < this.drawOrderRender && (this.drawOrderRender = l), !m.geometry && m.geometry_proxy && (m.geometry = m.geometry_proxy)), m.geometry)) {
                            var n = b == e.MESH_RENDERFLAG && f.isFlagSet(l, e.MESH_DRAWN);
                            if (b == e.MESH_RENDERFLAG) {
                                if (! (void 0 == this.drawOrderRender || l < this.drawOrderRender)) continue;
                                f.setFlagFragment(l, e.MESH_DRAWN, !0)
                            }
                            if (!n && h && f.pagingProxy) {
                                var o = f.getMaterial(l);
                                o && f.pagingProxy.onGeomTraversed(m.geometry, o.transparent)
                            }
                        }
                    } ! (c || m && m.geometry) || b && !f.isFlagSet(l, b) || a(m, l)
                }
                g && this.sortByShader()
            },
            d.prototype.applyVisibility = function() {
                function a(a, b, c, d) {
                    var e = !1;
                    l || (l = new THREE.Box3),
                        c.getWorldBounds(d, l);
                    var f = b.intersectsBox(l);
                    if (a && f === g.OUTSIDE) e = !0;
                    else if (c.pixelCullingEnable()) {
                        var h = b.projectedBoxArea(l, f === g.CONTAINS);
                        h *= b.areaConv,
                        h < c.pixelCullingThreshold() && (e = !0)
                    }
                    return e
                }
                function b(b, g) {
                    if (!b && c.useThreeMesh) return void(i && i(g));
                    if (m || a(j, f, c, g)) {
                        if (b ? b.visible = !1 : THREE.warn("Unexpected null mesh"), d[g] = d[g] & ~e.MESH_RENDERFLAG, c.pageOutGeometryEnabled()) {
                            var l = c.geomids[g],
                                n = c.geoms.getGeometry(l);
                            c.pagingProxy && c.pagingProxy.onGeomCulled(n)
                        }
                    } else {
                        var o = this.evalVisbility(h, d, g);
                        b && (b.visible = !!o),
                            k = k && !o
                    }
                }
                var c, d, f, h, i, j, k, l, m;
                return function(a, l, n) {
                    k = !0,
                        m = !1,
                        f = l,
                        h = a,
                        i = n,
                        c = this.frags;
                    var o = h === e.RENDER_HIDDEN ? this.boundingBoxHidden: this.boundingBox,
                        p = f.intersectsBox(o);
                    if (p === g.OUTSIDE && (m = !0), j = p !== g.CONTAINS, c.pixelCullingEnable()) {
                        var q = this.renderImportance;
                        0 == q && (q = f.projectedBoxArea(o, !j)),
                            q *= f.areaConv,
                        q < c.pixelCullingThreshold() && (m = !0)
                    }
                    return d = this.frags.vizflags,
                        this.forEach(b.bind(this), null, i),
                        k
                }
            } (),
            a.exports = d
    },
    function(a, b, c) {
        "use strict";
        function d(a, b, c, d) {
            for (var e = new THREE.Box3,
                     f = new j,
                     g = 0; g < c.length && !(f.costs >= d); g++) {
                var h = c[g];
                a.getWorldBounds(h, e);
                var i = a.getGeometry(h),
                    k = a.getMaterial(h);
                f.addGeom(i, k, e, h)
            }
            return f.createConsolidationMap(c, g)
        }
        function e(a, b, c, d, e) {
            if (! (d >= c.length)) {
                for (var f = d,
                         g = -1,
                         h = -1,
                         i = d; i < c.length; i++) {
                    var j = c[i],
                        k = a.getGeometryId(j),
                        l = a.getMaterialId(j);
                    k == g && l == h || (i != d && m(a, b, c, f, i, e), f = i, g = k, h = l)
                }
                m(a, b, c, f, c.length, e)
            }
        }
        function f(a) {
            for (var b = a.getCount(), c = [], d = 0; d < b; d++) {
                var e = a.getGeometryId(d),
                    f = 0 | c[e];
                c[e] = f + 1
            }
            return c
        }
        function g(a, b) {
            function c(c, d) {
                var e = a.getGeometry(c),
                    f = a.getGeometry(d),
                    g = b[e.id],
                    h = b[f.id],
                    i = g * e.byteSize,
                    j = h * f.byteSize;
                return i != j ? i - j: e.id != f.id ? e.id - f.id: a.getMaterialId(c) - a.getMaterialId(d)
            }
            for (var d = 0,
                     e = a.getCount(), f = new Int32Array(e), g = 0; g < e; g++) a.getGeometry(g) && (f[d] = g, d++);
            if (d < e && (f = new Int32Array(f.buffer, f.byteOffset, d)), f.sort) f.sort(c);
            else {
                var h = new Array(e);
                for (g = 0; g < e; g++) h[g] = f[g];
                for (h.sort(c), g = 0; g < f.length; g++) f[g] = h[g]
            }
            return f
        }
        function h(a, b, c, d) {
            for (var e = a.geoms,
                     f = [], g = 0, h = 0, i = 0; i < b.meshes.length; i++) {
                var j = b.meshes[i],
                    k = j.geometry;
                k.byteSize || (k.byteSize = (k.vb.byteLength || 0) + (k.ib.byteLength || 0));
                var l = Number.isInteger(j.fragId);
                e.chooseMemoryType(k, k.numInstances, g, h),
                k.streamingDraw || (h += k.byteSize, g += 1, l || (k.discardAfterUpload = !0)),
                l && (f[k.id] = !0)
            }
            for (i = 1; i < e.geoms.length; i++) if ((k = e.geoms[i]) && !f[i]) {
                var m = c[i];
                e.chooseMemoryType(k, m, g, h),
                k.streamingDraw && d.deallocateGeometry(k),
                k.streamingDraw || (h += k.byteSize, g += 1)
            }
        }
        function i(a, b, c, i, j) {
            var k = i.supportsInstancedArrays();
            c = c || 100 << 20;
            var l = f(a);
            if (!j) {
                j = d(a, b, g(a, l), c)
            }
            var m = j.buildConsolidation(a, b, a.model),
                n = j.fragOrder,
                o = j.numConsolidated;
            if (k) e(a, b, n, o, m);
            else for (var p = o; p < n.length; p++) {
                var q = n[p];
                m.addSingleFragment(a, q)
            }
            h(a, m, l, i);
            var r = a.model.getModelId();
            for (p = 0; p < m.meshes.length; p++) {
                m.meshes[p].modelId = r
            }
            return m
        }
        var j = c(85).ConsolidationBuilder,
            k = c(84),
            l = c(89).MATERIAL_VARIANT,
            m = function() {
                var a = null,
                    b = [];
                return function(c, d, e, f, g, h) {
                    a || (a = new THREE.Matrix4);
                    var i = e[f],
                        j = c.getGeometry(i),
                        m = c.getMaterial(i),
                        n = g - f;
                    if (1 == n) return void h.addSingleFragment(c, i);
                    b.length = 0;
                    for (var o = new k(j, n), p = f; p < g; p++) {
                        var q = e[p];
                        c.getOriginalWorldMatrix(q, a);
                        var r = c.fragments.fragId2dbId[q];
                        o.addInstance(a, r) || b.push(q)
                    }
                    var s = o.finish();
                    if (s) {
                        var t = d.getMaterialVariant(m, l.INSTANCED, c.model);
                        h.addContainerMesh(s, t, e, f, n)
                    }
                    for (p = 0; p < b.length; p++) q = b[p],
                        h.addSingleFragment(c, q)
                }
            } ();
        a.exports = i
    },
    function(a, b, c) {
        "use strict";
        function d(a, b) {
            function c(a) {
                m[a] || (m[a] = new THREE.Scene);
                var b = m[a];
                return b.children.length = 0,
                    b
            }
            function d(a) {
                return a.numInstances ? p.Instanced: a.attributes.id ? p.Merged: p.Original
            }
            function h(a) {
                if (l) return p.Original;
                var b = j.fragId2MeshIndex[a];
                return d(j.meshes[b].geometry)
            }
            var i = a,
                j = b,
                k = [],
                l = !1,
                m = [],
                n = new THREE.Matrix4,
                o = new THREE.Box3;
            this.getConsolidation = function() {
                return j
            },
                this.reset = function() {
                    k.length = null;
                    var a = i.getCount();
                    l = !1;
                    for (var b = i.db2ThemingColor.length > 0,
                             c = 0; c < a; c++) {
                        var d = i.vizflags[c],
                            f = 0 == (d & e.MESH_VISIBLE),
                            g = 0 != (d & e.MESH_HIDE),
                            h = 0 != (d & e.MESH_MOVED),
                            j = !1;
                        if (b) {
                            var m = i.fragments.fragId2dbId[c];
                            j = !!i.db2ThemingColor[m]
                        }
                        if (f || g || j || h) {
                            l = !0;
                            break
                        }
                    }
                },
                this.dispose = function() {
                    for (var a = 0; a < j.meshes.length; a++) {
                        var b = j.meshes[a],
                            c = b.geometry;
                        c && (c.dispose(), c.needsUpdate = !0)
                    }
                },
                this.consolidateNextBatch = function(a, b) {
                    var d = a.nodeIndex;
                    if (l || void 0 === d) return a;
                    if (j.inProgress) return a;
                    for (var e = c(d), f = a.start; f < a.lastItem; f++) {
                        var g = a.indices ? a.indices[f] : f,
                            h = j.fragId2MeshIndex[g],
                            m = null;
                        if ( - 1 === h) {
                            if (!i.getGeometry(g)) continue;
                            return THREE.warn("Warning: Missing fragment in consolidation. Consolidation disabled."),
                                a
                        }
                        k[h] || (i.getWorldBounds(g, o), b.intersectsBox(o) && (m = j.meshes[h], k[h] = !0, e.children.push(m)))
                    }
                    return e.boundingBox = a.boundingBox,
                        e.renderImportance = a.renderImportance,
                        e.sortObjects = a.sortObjects,
                        e
                };
            var p = {
                Merged: 1,
                Instanced: 2,
                Original: 3
            };
            this.updateRenderProxy = function(a, b) {
                if (a.geometry && a.geometry.attributes) {
                    var c = h(b);
                    if (d(a.geometry) != c) {
                        var e = i.getGeometry(b),
                            k = j.fragId2MeshIndex[b],
                            l = j.meshes[k];
                        if (c === p.Original) a.geometry = e,
                            a.material = i.getMaterial(b),
                            i.getWorldMatrix(b, a.matrix);
                        else if (c === p.Instanced) {
                            i.getWorldMatrix(b, n);
                            var m = i.fragments.fragId2dbId[b],
                                q = new g(e, 1);
                            q.addInstance(n, m),
                                a.geometry = q.finish(),
                                a.material = l.material,
                                a.matrix.identity()
                        } else i.getWorldMatrix(b, n),
                            i.getWorldBounds(b, o),
                            m = i.fragments.fragId2dbId[b],
                            a.geometry = f([e], n.elements, [m], o),
                            a.material = l.material,
                            a.matrix.identity();
                        a.dispatchEvent({
                            type: "removed"
                        })
                    }
                }
            }
        }
        var e = c(71),
            f = c(85).mergeGeometries,
            g = c(84);
        a.exports = d
    },
    function(a, b, c) {
        "use strict";
        function d() {
            function a(a) {
                var b = p[a],
                    c = i;
                if (q) for (; c > d && p[o[c - 1]] > b;) o[c] = o[c - 1],
                    c--;
                else for (; c > d && p[o[c - 1]] < b;) o[c] = o[c - 1],
                    c--;
                o[c] = a,
                    i++
            }
            function b(a) {
                var c = k.getLeftChild(a); - 1 !== c && (b(c), b(c + 1)),
                    u.makeEmpty(),
                -1 !== c && (k.getBoxThree(c, v), u.union(v), k.getBoxThree(c + 1, v), u.union(v)),
                k.getPrimCount(a) && (u.union(m[a].boundingBox), u.union(m[a].boundingBoxHidden)),
                    k.setBoxThree(a, u)
            }
            var c, d, i, j, k = null,
                l = null,
                m = null,
                n = null,
                o = null,
                p = null,
                q = 1,
                r = !0,
                s = !1,
                t = !1,
                u = new THREE.Box3,
                v = new THREE.Box3,
                w = !1;
            this.initialize = function(a, b, d, e) {
                c = a.getFragmentList(),
                e && e.hasOwnProperty("prioritize_screen_size") && (r = e.prioritize_screen_size),
                    l = d,
                    m = new Array(b.nodeCount),
                    n = new Int8Array(b.nodeCount),
                    k = b,
                    o = new Int32Array(b.nodeCount + 1),
                    p = new Float32Array(b.nodeCount);
                for (var h = c.onDemandLoadingEnabled() ? g: f, i = 0; i < b.nodeCount; i++) {
                    var j = b.getPrimCount(i);
                    j && (m[i] = new h(c, l, b.getPrimStart(i), j), m[i].lastItem = m[i].start + j, m[i].numAdded = j, m[i].nodeIndex = i, 8 & b.getFlags(i) && (m[i].sortObjects = !0), b.getBoxThree(i, m[i].boundingBox))
                }
            },
                this.addFragment = function(a, b) {},
                this.reset = function(a) {
                    j = a,
                        d = 0,
                        i = 0,
                        n[0] = n[1] = e.CONTAINMENT_UNKNOWN,
                        o[i++] = 0,
                        s = !1,
                        t = !1,
                        w = !1
                },
                this.nextBatch = function() {
                    for (t || s || d !== i || (o[i++] = 1, s = !0); d !== i;) {
                        var b = q || s ? o[--i] : o[d++],
                            c = n[b];
                        if (c !== h.CONTAINS && (k.getBoxThree(b, u), c = j.intersectsBox(u)), c !== h.OUTSIDE) {
                            var e, f, g = k.getLeftChild(b),
                                l = -1 !== g;
                            if (l) {
                                var v = k.getFlags(b),
                                    x = j.viewDir[3 & v] < 0 ? 1 : 0,
                                    y = v >> 2 & 1,
                                    z = v >> 3 & 1,
                                    A = q || s ? 1 : 0,
                                    B = 0,
                                    C = 0;
                                r && !s ? (e = g + y, f = g + 1 - y, k.getBoxThree(e, u), p[e] = B = j.projectedBoxArea(u, c === h.CONTAINS), k.getBoxThree(f, u), p[f] = C = j.projectedBoxArea(u, c === h.CONTAINS), n[e] = n[f] = c, B > 0 && a(e), C > 0 && a(f)) : (x ^ A ^ z && (y = 1 - y), e = g + y, f = g + 1 - y, o[i++] = e, p[e] = -1, o[i++] = f, p[f] = -1, n[e] = n[f] = c)
                            }
                            if (0 !== k.getPrimCount(b)) {
                                var D = m[b];
                                return D.renderImportance = j.projectedBoxArea(D.boundingBox, c === h.CONTAINS),
                                    D
                            }
                        }
                        s || t || d !== i || (o[i++] = 1, s = !0)
                    }
                    return w = !0,
                        null
                },
                this.skipOpaqueShapes = function() {
                    s || t || (d = 0, i = 0, o[i++] = 1, t = !0)
                },
                this.getVisibleBounds = function(a, c) {
                    for (var d = 0; d < m.length; d++) {
                        var e = m[d];
                        e && (e.calculateBounds(), a.union(e.boundingBox), c.union(e.boundingBox), c.union(e.boundingBoxHidden))
                    }
                    b(0),
                        b(1)
                },
                this.rayCast = function(a, b, c) {
                    for (var d = [1, 0], e = new THREE.Vector3; d.length;) {
                        var f = d.pop();
                        k.getBoxThree(f, u),
                            u.expandByScalar(.5);
                        if (null !== a.ray.intersectBox(u, e)) {
                            var g = k.getLeftChild(f); - 1 !== g && (d.push(g), d.push(g + 1));
                            if (0 !== k.getPrimCount(f)) {
                                m[f].raycast(a, b, c)
                            }
                        }
                    }
                },
                this.getSceneCount = function() {
                    return m.length
                },
                this.getGeomScenes = function() {
                    return m
                },
                this.done = function() {
                    return w
                }
        }
        var e = c(71),
            f = c(82),
            g = c(111),
            h = c(83);
        a.exports = d
    },
    function(a, b, c) {
        "use strict";
        function d() {
            function a(a, b) {
                void 0 === a.avgFrameTime ? a.avgFrameTime = b: a.avgFrameTime = .8 * a.avgFrameTime + .2 * b
            }
            function b(b, c, d) {
                var e, f;
                for (e = 0; e < b.length; e++) f = b[e],
                    f.cameraDistance = f.boundingBox.distanceToPoint(c.position);
                var g = function(a, b) {
                    return b.cameraDistance - a.cameraDistance
                };
                b.sort(g);
                var h = performance.now();
                for (e = 0; e < b.length; e++) {
                    f = b[e],
                        d(f);
                    var i = performance.now(),
                        j = i - h;
                    h = i,
                        a(f, j)
                }
            }
            var c = !1,
                d = !1,
                g = 0,
                h = [],
                i = [],
                j = [],
                k = new THREE.Box3,
                l = [],
                m = new f,
                n = new THREE.Raycaster,
                o = 0,
                p = performance,
                q = e.PAGEOUT_NONE;
            this.enableNonResumableFrames = !1,
                this.budgetForTransparent = .1;
            var r = !1,
                s = [],
                t = null;
            this.frustum = function() {
                return m
            },
                this.addModel = function(a) {
                    h.push(a),
                        i.length = h.length,
                        j.length = h.length
                },
                this.removeModel = function(a) {
                    var b = h.indexOf(a);
                    return b >= 0 && h.splice(b, 1),
                        i.length = h.length,
                        j.length = h.length,
                    b >= 0
                },
                this.isEmpty = function() {
                    return 0 === h.length
                },
                this.needsRender = function() {
                    return c
                },
                this.resetNeedsRender = function() {
                    c = !1
                },
                this.frameResumePossible = function() {
                    return ! r
                },
                this.renderSome = function(f, k, l) {
                    for (var m, n, o = p.now(), u = 0 === g, v = this.budgetForTransparent * k;;) {
                        for (var w = 0,
                                 x = null,
                                 y = 0; y < i.length; y++) {
                            var z = i[y];
                            n = h[y],
                            z || (i[y] = z = n.nextBatch());
                            if (r && k < v) {
                                z && !z.sortObjects && (n.skipOpaqueShapes(), z = n.nextBatch())
                            }
                            null !== z && (x || (w = y, x = z), z.renderImportance > x.renderImportance && (w = y, x = z))
                        }
                        if (!x) {
                            d = !0;
                            for (var A = 0; A < h.length; ++A) if ((n = h[A]) && n.is2d() && !n.isLoadDone() && !n.getFragmentList().onDemandLoadingEnabled()) {
                                d = !1;
                                break
                            }
                            break
                        }
                        if (h[w].is2d() && h[w].getFragmentList() && h[w].getFragmentList().onDemandLoadingEnabled()) {
                            var B = j[w];
                            x.drawOrderRender = B && B.drawOrderRender < B.lastItem ? x.start: x.lastItem,
                                j[w] = x
                        }
                        if (i[w] = h[w].nextBatch(), g++, x.sortObjects && r) s.push(x),
                            k -= void 0 === x.avgFrameTime ? .05 : x.avgFrameTime;
                        else {
                            f(x),
                            x.hasOwnProperty("drawEnd") && (x.drawEnd = x.lastItem),
                                m = p.now();
                            var C = m - o;
                            o = m,
                                a(x, C),
                                k -= x.avgFrameTime
                        }
                        if (h[w].getFragmentList() && h[w].getFragmentList().onDemandLoadingEnabled()) for (var D, E = x.start,
                                                                                                                F = x.lastItem,
                                                                                                                G = h[w].getFragmentList().vizflags, H = x.getIndices(); E < F;) D = H ? H[E] : E,
                        G[D] & e.MESH_DRAWN && (G[D] = (G[D] | e.MESH_TRAVERSED) & ~e.MESH_DRAWN),
                            ++E;
                        if (k <= 0) break
                    }
                    var I = h[0].frameUpdatePaging(u, l);
                    return (q != I || h[0].needResumeNextFrame()) && (c = !0, q = I),
                    s.length > 0 && (b(s, t, f), s.length = 0),
                        k
                },
                this.reset = function(a, b, c) {
                    if (o++, d = !1, g = 0, this.resetNeedsRender(), m.reset(a), m.areaCullThreshold = e.PIXEL_CULLING_THRESHOLD, h.length) {
                        r = this.enableNonResumableFrames && c && b === e.RENDER_NORMAL,
                            t = a;
                        for (var f = 0; f < h.length; f++) h[f].resetIterator(a, m, b, c),
                            i[f] = h[f].nextBatch(),
                            j[f] = null
                    }
                },
                this.isDone = function() {
                    return d || this.isEmpty()
                },
                this.setAllVisibility = function(a) {
                    for (var b = 0; b < h.length; b++) h[b].setAllVisibility(a)
                },
                this.hideLines = function(a) {
                    for (var b = 0; b < h.length; b++) h[b].hideLines(a)
                },
                this.hidePoints = function(a) {
                    for (var b = 0; b < h.length; b++) h[b].hidePoints(a)
                },
                this.hasHighlighted = function() {
                    for (var a = 0; a < h.length; a++) if (h[a].hasHighlighted()) return ! 0;
                    return ! 1
                },
                this.areAllVisible = function() {
                    for (var a = 0; a < h.length; a++) if (!h[a].areAllVisible()) return ! 1;
                    return ! 0
                },
                this.invalidateVisibleBounds = function() {
                    for (var a = 0; a < h.length; a++) h[a].visibleBoundsDirty = !0
                },
                this.getVisibleBounds = function(a) {
                    if (1 === h.length) return h[0].getVisibleBounds(a);
                    k.makeEmpty();
                    for (var b = 0; b < h.length; b++) k.union(h[b].getVisibleBounds(a));
                    return k
                },
                this.findModel = function(a) {
                    for (var b = 0; b < h.length; b++) if (h[b].getModelId() === a) return h[b];
                    return null
                },
                this.rayIntersect = function(a, b, c, d, e, f) {
                    n.set(a, b);
                    var g;
                    if (h.length > 1) {
                        var i = [];
                        if (e) for (g = 0; g < e.length; g++) {
                            var j = this.findModel(e[g]);
                            j && j.rayIntersect(n, c, [d[g]])
                        } else for (g = 0; g < h.length; g++) if (!h[g].is2d()) {
                            var k = h[g].rayIntersect(n, c, d, f);
                            k && i.push(k)
                        }
                        return i.length ? (i.sort(function(a, b) {
                            return a.distance - b.distance
                        }), i[0]) : null
                    }
                    return ! h.length || h[0].is2d() ? null: h[0].rayIntersect(n, c, d, f)
                },
                this.getRenderProgress = function() {
                    return h[0].getRenderProgress()
                },
                this.getModels = function() {
                    return h
                },
                this.getHiddenModels = function() {
                    return l
                },
                this.getFragmentList = function() {
                    return h[0].getFragmentList()
                },
                this.getGeometryList = function() {
                    return h[0].getGeometryList()
                },
                this.getSceneCount = function() {
                    return h[0].getSceneCount()
                },
                this.getGeomScenes = function() {
                    return h[0].getGeomScenes()
                },
                this.geomPacksMissingLastFrame = function() {
                    return h[0].geomPacksMissingLastFrame()
                },
                this.explode = function(a) {
                    if (h.length) {
                        for (var b = new THREE.Vector3,
                                 c = 0; c < h.length; c++) {
                            var d = h[c],
                                e = d.getData().instanceTree,
                                f = d.getFragmentList(),
                                g = d.getVisibleBounds(!0).center();
                            if (a *= 2, e && e.nodeAccess.nodeBoxes && 0 !== a) {
                                var i = a * (e.maxDepth - 1) + 1,
                                    j = 0 | i,
                                    k = i - j,
                                    l = new Float32Array(6); !
                                    function c(d, g, h, i, m, n, o, p) {
                                        var q = 2 * a;
                                        g == j && (q *= k),
                                            e.getNodeBox(d, l);
                                        var r = .5 * (l[0] + l[3]),
                                            s = .5 * (l[1] + l[4]),
                                            t = .5 * (l[2] + l[5]);
                                        if (g > 0 && g <= j) {
                                            var u = (r - h) * q,
                                                v = (s - i) * q,
                                                w = (t - m) * q;
                                            n += u,
                                                o += v,
                                                p += w
                                        }
                                        e.enumNodeChildren(d,
                                            function(a) {
                                                c(a, g + 1, r, s, t, n, o, p)
                                            },
                                            !1),
                                            b.x = n,
                                            b.y = o,
                                            b.z = p,
                                            e.enumNodeFragments(d,
                                                function(a) {
                                                    f.updateAnimTransform(a, null, null, b)
                                                },
                                                !1)
                                    } (e.getRootId(), 0, g.x, g.y, g.x, 0, 0, 0)
                            } else for (var m = f.fragments.boxes,
                                            n = 0,
                                            o = f.getCount(); n < o; n++) if (0 == a) f.updateAnimTransform(n);
                            else {
                                var p = 6 * n,
                                    q = .5 * (m[p] + m[p + 3]),
                                    r = .5 * (m[p + 1] + m[p + 4]),
                                    s = .5 * (m[p + 2] + m[p + 5]);
                                b.x = a * (q - g.x),
                                    b.y = a * (r - g.y),
                                    b.z = a * (s - g.z),
                                    f.updateAnimTransform(n, null, null, b)
                            }
                        }
                        this.invalidateVisibleBounds()
                    }
                },
                this.update = function(a) {
                    for (var b = !1,
                             c = 0; c < h.length; c++) {
                        var d = h[c];
                        b = b || d.update(a)
                    }
                    return b
                },
                this.hideModel = function(a) {
                    for (var b = 0; b < h.length; b++) {
                        var c = h[b];
                        if (c && c.id === a) return this.removeModel(c),
                            l.push(c),
                            !0
                    }
                    return ! 1
                },
                this.showModel = function(a) {
                    for (var b = 0; b < l.length; ++b) {
                        var c = l[b];
                        if (c && c.id === a) return this.addModel(c),
                            l.splice(b, 1),
                            !0
                    }
                    return ! 1
                },
                this.getMemoryInfo = function() {
                    function a(a) {
                        for (var d = 0; d < a.length; ++d) {
                            var e = a[d].getMemoryInfo();
                            e && (b = e, c.limit += e.limit, c.effectiveLimit += e.effectiveLimit, c.loaded += e.loaded)
                        }
                    }
                    var b, c = {
                        limit: 0,
                        effectiveLimit: 0,
                        loaded: 0
                    };
                    return a(h),
                        a(l),
                        b ? c: null
                }
        }
        var e = c(71),
            f = c(83).FrustumIntersector;
        a.exports = d
    },
    function(a, b) {
        "use strict";
        var c = function(a) {
            function b(a, f, g) {
                if (f || (f = 0), g || (g = e.length), f >= g) return g;
                if (g === f + 1) {
                    var h = d[e[f]];
                    return c(h, a) ? g: f
                }
                var i = parseInt(f + (g - f) / 2),
                    j = d[e[i - 1]];
                return c(a, j) ? b(a, f, i) : c(j, a) ? b(a, i, g) : i - 1
            }
            var c = a ||
                    function(a, b) {
                        return a < b
                    },
                d = [],
                e = [];
            this.add = function(a) {
                var c = b(a);
                if (c == e.length) return d.push(a),
                    void e.push(d.length - 1);
                d.push(a),
                    e.splice(c, 0, d.length - 1)
            },
                this.size = function() {
                    return e.length
                },
                this.get = function(a) {
                    return d[e[a]]
                },
                this.removeAt = function(a) {
                    var b = e[a];
                    d[b] = void 0,
                        e.splice(a, 1)
                },
                this.toString = function() {
                    for (var a = "",
                             b = 0,
                             c = this.size(); b < c; ++b) a += this.get(b),
                    b < c - 1 && (a += ", ");
                    return a
                }
        };
        a.exports = c
    },
    function(a, b, c) {
        "use strict";
        function d(a, b, c) {
            if (a) {
                if (a - 3 * b * 2 <= f.GPU_MEMORY_LIMIT && c < f.GPU_OBJECT_LIMIT) return ! 1
            }
            return ! 0
        }
        function e() {
            function a(a) {
                var c = b.getFragmentList().fragments.packIds[a];
                u.pagingProxy && u.pagingProxy.addGeomPackMissingLastFrame(c)
            }
            var b = this,
                c = new THREE.Box3,
                e = new THREE.Box3,
                r = new THREE.Box3;
            this.visibleBoundsDirty = !1,
                this.enforceBvh = !1,
                this.isvizCacheEnabled = !1;
            var s = 0;
            this.id = p++;
            var t = null,
                u = null,
                v = null,
                w = null,
                x = null,
                y = null,
                z = null,
                A = 0,
                B = null,
                C = f.RENDER_NORMAL,
                D = q[f.RENDER_NORMAL],
                E = !1,
                F = f.PAGEOUT_NONE;
            this.getGeometryList = function() {
                return t
            },
                this.getFragmentList = function() {
                    return u
                },
                this.getModelId = function() {
                    return this.id
                },
                this.initialize = function(a) {
                    var b = this.getData(),
                        f = b.numGeoms || 0,
                        i = !d(b.packFileTotalSize, b.primitiveCount, f);
                    t = new g(f, this.is2d(), i),
                        u = new h(this, a);
                    var j = this.getBoundingBox();
                    j && (c.copy(j), e.copy(j)),
                        x = v = new l(this)
                },
                this.initFromCustomIterator = function(a) {
                    x = a,
                        this.visibleBoundsDirty = !0
                },
                this.dtor = function(a) {
                    u && u.dispose(a),
                    x && x.dtor && x.dtor(),
                    y && y.dispose()
                },
                this.activateFragment = function(a, b, d) {
                    u && (u.setMesh(a, b, d), x.addFragment(a), u.getWorldBounds(a, r), c.union(r), e.union(r))
                },
                this.setFragment = function(a, b) {
                    return void 0 === a && (a = this.getFragmentList().getNextAvailableFragmentId()),
                        u.setMesh(a, b, !0),
                    v && v.addFragment(a),
                    w && !u.fragmentsHaveBeenAdded() && w.addFragment(a),
                        u.getWorldBounds(a, r),
                        c.union(r),
                        e.union(r),
                        a
                },
                this.setBVH = function(a, b, c) {
                    x = w = new m,
                        x.initialize(this, a, b, c)
                },
                this.resetIterator = function(a, b, c, d) {
                    if (u && u.pagingProxy && u.pagingProxy.resetIterator(a, d), d && (u && u.onDemandLoadingEnabled() && u.setFlagGlobal(f.MESH_TRAVERSED, !1), u && u.pageOutGeometryEnabled())) {
                        F = f.PAGEOUT_NONE,
                        u.pagingProxy && u.pagingProxy.reset();
                        var e, g, h = x.getGeomScenes();
                        for (g = h.length, e = 0; e < g; e++) {
                            var i = h[e];
                            i && i.resetVisStatus && i.resetVisStatus()
                        }
                    }
                    return E = !1,
                    w && !u.fragmentsHaveBeenAdded() && (E = !0),
                    this.isvizCacheEnabled && (E = !1),
                        E ? x = w: v && (x = v),
                        A = 0,
                        C = c,
                        D = c < q.length ? q[c] : q[f.RENDER_NORMAL],
                        B = b,
                        x.reset(b, a),
                    u && u.resetBoxRun(),
                    y && y.reset(),
                        x
                },
                this.nextBatch = function() {
                    for (;;) {
                        var b = x.nextBatch();
                        if (A++, !b) return null;
                        if (y && b instanceof i && (b = y.consolidateNextBatch(b, B)), b instanceof THREE.Scene) return b;
                        if (b.visibleStats & D) c = !(b.visibleStats & D << 16);
                        else {
                            var c = b.applyVisibility(C, B, this.getFragmentList().fragments.packIds ? a: function() {});
                            void 0 !== b.visibleStats && (b.visibleStats |= D, c || (b.visibleStats |= D << 16)),
                            c || this.is2d() || (b.sortObjects && !this.getFragmentList().useThreeMesh ? b.sortByDepth(B) : b.sortDone || b.sortByMaterial())
                        }
                        if (!c) return b
                    }
                },
                this.getVisibleBounds = function(a) {
                    return this.visibleBoundsDirty && (c.makeEmpty(), e.makeEmpty(), x.getVisibleBounds(c, e, a), this.visibleBoundsDirty = !1),
                        a ? e: c
                },
                this.rayIntersect = function(a, b, c, d) {
                    this.visibleBoundsDirty && this.getVisibleBounds();
                    var e, f = [];
                    if (c && c.length > 0) {
                        var g = this.getFragmentMap(),
                            h = [];
                        if (g) for (e = 0; e < c.length; e++) g.enumNodeFragments(c[e],
                            function(a) {
                                h.push(a)
                            },
                            !0);
                        else h = c;
                        if (h.length > 2) x.rayCast(a, f, c);
                        else for (e = 0; e < h.length; e++) {
                            var i = u.getVizmesh(h[e]);
                            if (i) {
                                var j = o.rayCast(i, a, f);
                                j && f.push(j)
                            }
                        }
                    } else x.rayCast(a, f);
                    if (!f.length) return null;
                    f.sort(function(a, b) {
                        return a.distance - b.distance
                    });
                    var k = !!d;
                    for (d = d || [], e = 0; e < f.length; e++) {
                        var l = f[e].fragId;
                        if (!this.is2d()) {
                            if (this.isFragVisible(l)) {
                                var m = u.getMaterial(l);
                                if (b && m.transparent) continue;
                                var n = f[e],
                                    p = !1,
                                    q = n.point;
                                if (m && m.cutplanes) for (var r = 0; r < m.cutplanes.length; r++) p = p || m.cutplanes[r].dot(new THREE.Vector4(q.x, q.y, q.z, 1)) > 1e-6;
                                if (p || d.push(n), n.model = this, !k && d.length > 0) break
                            }
                        }
                    }
                    var s = d[0] || null;
                    return s && (s.model = this),
                        s
                },
                this.setHighlighted = function(a, b) {
                    if (!u) return ! 1;
                    var c = u.setFlagFragment(a, f.MESH_HIGHLIGHTED, b);
                    return c && (b ? s++:s--),
                        c
                },
                this.setVisibility = function(a, b) {
                    u && (u.setVisibility(a, b), this.visibleBoundsDirty = !0)
                },
                this.setAllVisibility = function(a) {
                    u && (u.setAllVisibility(a), this.visibleBoundsDirty = !0)
                },
                this.hideLines = function(a) {
                    u && u.hideLines(a)
                },
                this.hidePoints = function(a) {
                    u && u.hidePoints(a)
                },
                this.hasHighlighted = function() {
                    return !! s
                },
                this.isFragVisible = function(a) {
                    return u.isFragVisible(a)
                },
                this.areAllVisible = function() {
                    return ! u || u.areAllVisible()
                },
                this.getGeomScenes = function() {
                    return x.getGeomScenes()
                },
                this.getRenderProgress = function() {
                    var a = A / x.getSceneCount();
                    return a > 1 ? 1 : a
                },
                this.pageOutIfNeeded = function(a, b, c) {
                    return u.pagingProxy ? u.pagingProxy.pageOut(a, b, c) : f.PAGEOUT_NONE
                },
                this.frameUpdatePaging = function(a, b) {
                    return u && u.pageOutGeometryEnabled() ? (F = this.pageOutIfNeeded(!1, !1, b), x.done() && (F = this.pageOutIfNeeded(!0, !1, b)) == f.PAGEOUT_FAIL && (F = this.pageOutIfNeeded(!0, !0, b)), F) : F
                },
                this.geomPacksMissingLastFrame = function() {
                    return u && u.pagingProxy ? u.pagingProxy.geomPacksMissingLastFrame() : []
                },
                this.addGeomPackMissingLastFrame = function(a) {
                    return ! u || !u.pagingProxy || u.pagingProxy.addGeomPackMissingLastFrame(a)
                },
                this.needResumeNextFrame = function() {
                    return ! (!u || !u.pagingProxy) && u.pagingProxy.needResumeNextFrame()
                },
                this.update = function(a) {
                    return ! (!x || !x.update) && x.update(a)
                },
                this.setThemingColor = function(a, b) {
                    u ? u.setThemingColor(a, b) : THREE.warn("Theming colors are not supported by this model type.")
                },
                this.clearThemingColors = function() {
                    u && u.clearThemingColors()
                },
                this.getLeaflet = function() {
                    return x instanceof n ? x: null
                },
                this.consolidate = function(a, b, c) {
                    var d = j(u, a, b, c, z);
                    y = new k(u, d),
                        z = d.consolidationMap
                },
                this.unconsolidate = function() {
                    y && (y.dispose(), y = null)
                },
                this.isConsolidated = function() {
                    return !! y
                },
                this.getConsolidation = function() {
                    return y ? y.getConsolidation() : null
                },
                this.getFragmentMap = function() {
                    throw "Method has not been implemented"
                },
                this.getBoundingBox = function() {
                    throw "Method has not been implemented"
                },
                this.is2d = function() {
                    throw "Method has not been implemented"
                },
                this.updateRenderProxy = function(a, b) {
                    y && y.updateRenderProxy(a, b)
                },
                this.skipOpaqueShapes = function() {
                    x && x.skipOpaqueShapes && x.skipOpaqueShapes()
                },
                this.getMemoryInfo = function() {
                    return u.getMemoryInfo()
                }
        }
        var f = c(71),
            g = c(81),
            h = c(118).FragmentList,
            i = c(82),
            j = c(112),
            k = c(113),
            l = c(110),
            m = c(114),
            n = c(119).ModelIteratorTexQuad,
            o = c(80),
            p = 1,
            q = [1, 1, 2, 4];
        a.exports = e
    },
    function(a, b, c) {
        "use strict";
        function d(a, b) {
            this.model = a,
                this.fragments = a.getData().fragments,
                this.geoms = a.getGeometryList(),
                this.pagingProxy = b,
                this.isFixedSize = this.fragments.length > 0,
                this.isFixedSize ? (this.boxes = this.fragments.boxes, this.transforms = this.fragments.transforms, this.useThreeMesh = !i.memoryOptimizedLoading) : (this.boxes = null, this.transforms = null, this.useThreeMesh = !b || !b.onDemandLoadingEnabled());
            var c = this.fragments.length;
            c <= 0 && (c = 1),
                this.vizflags = new Uint16Array(c),
            this.useThreeMesh && (this.vizmeshes = new Array(c)),
                this.geomids = new Int32Array(c),
                this.materialids = new Int32Array(c),
                this.materialmap = {},
                this.db2ThemingColor = [],
                this.originalColors = [],
                this.themingOrGhostingNeedsUpdate = [],
                this.dbIdIsHidden = [],
                this.dbIdIsGhosted = [],
                this.reachLimit = !1,
                this.animxforms = null;
            for (var d = 0; d < c; d++) this.vizflags[d] = 1,
                this.geomids[d] = -1;
            this.allVisible = !0,
                this.allVisibleDirty = !1,
                this.nextAvailableFragID = c,
                this.boxTransform = [],
                this.boxCount = 0
        }
        function e(a) {
            var b = a.r;
            return a.r = a.b,
                a.b = b,
                a
        }
        function f(a, b) {
            var c = a.originalColors[b];
            if (a.themingOrGhostingNeedsUpdate[b]) {
                var d = a.getGeometry(b),
                    e = d ? d.attributes: null,
                    f = e ? e.color4b: null,
                    g = e ? e.dbId4b: null,
                    h = e ? e.layerVp4b: null,
                    i = e ? e.flags4b: null;
                if (f && g && d.vb && h && i) {
                    for (var k = new Uint32Array(d.vb.buffer), l = d.vbstride, m = k.length / d.vbstride, n = !1, o = f.itemOffset, p = g.itemOffset, q = h.itemOffset, r = i.itemOffset, s = 0; s < m; s++) {
                        var t = k[s * l + p],
                            u = c ? c[s] : k[s * l + o],
                            v = k[s * l + q];
                        t = t << 8 >> 8;
                        var w = -1 == t && 0 == (v & parseInt("FFFF", 16)),
                            x = a.db2ThemingColor[t],
                            y = a.dbIdIsHidden[t];
                        if (x || y) {
                            if (!c) {
                                c = new Uint32Array(m);
                                for (var z = 0; z < m; z++) c[z] = k[z * l + o];
                                a.originalColors[b] = c
                            }
                            u = y ? 0 : j(u, x),
                                n = !0
                        } else c && (u = c[s]);
                        k[s * l + o] = u;
                        var A = a.dbIdIsGhosted[t] && !w,
                            B = k[s * l + r];
                        A ? B |= 255 << 24 : B &= 16777215,
                            k[s * l + r] = B
                    }
                    n || (a.originalColors[b] = null),
                        d.vbNeedsUpdate = !0,
                        a.themingOrGhostingNeedsUpdate[b] = !1
                }
            }
        }
        function g(a, b) {
            if (a.model.is2d()) {
                var c = a.fragments.dbId2fragId[b];
                if (Array.isArray(c)) for (var d = 0; d < c.length; d++) a.themingOrGhostingNeedsUpdate[c[d]] = !0;
                else "number" == typeof c && (a.themingOrGhostingNeedsUpdate[c] = !0)
            }
        }
        function h(a, b) {
            this.frags = a,
                this.fragId = b,
                this.scale = null,
                this.quaternion = null,
                this.position = null
        }
        var i = c(71);
        d.prototype.resetBoxRun = function() {
            this.boxCount = 0
        },
            d.prototype.getNextAvailableFragmentId = function() {
                return this.nextAvailableFragID++
            },
            d.prototype.fragmentsHaveBeenAdded = function() {
                return this.vizflags.length > this.fragments.length
            },
            d.prototype.getSvfMaterialId = function(a) {
                var b = this.getMaterial(a);
                return b ? b.svfMatId: void 0
            },
            d.prototype.onDemandLoadingEnabled = function() {
                return this.pagingProxy && this.pagingProxy.onDemandLoadingEnabled()
            },
            d.prototype.pageOutGeometryEnabled = function() {
                return this.pagingProxy && this.pagingProxy.pageOutGeometryEnabled()
            },
            d.prototype.pixelCullingEnable = function() {
                return this.pagingProxy && this.pagingProxy.pixelCullingEnable()
            },
            d.prototype.pixelCullingThreshold = function() {
                return this.pagingProxy ? this.pagingProxy.pixelCullingThreshold() : 0
            },
            d.prototype.requireGeometry = function(a) {
                var b = null,
                    c = this.geomids[a];
                if (c >= 0 && (b = this.geoms.getGeometry(c)), null == b) {
                    var d = this.fragments.packIds ? this.fragments.packIds[a] : a;
                    this.pagingProxy && this.pagingProxy.loadPackFile(d)
                }
                return b
            },
            d.prototype.promiseGeometry = function(a) {
                function b(a, b) {
                    var c;
                    return c = a.then(function() {
                            return c && (delete c.lmv_loader_promise, c.lmv_geom_canceled) ? Promise.reject({
                                canceled: !0
                            }) : b
                        },
                        function(a) {
                            return c && (delete c.lmv_loader_promise, c.lmv_geom_canceled) ? Promise.reject({
                                canceled: !0
                            }) : Promise.reject(a)
                        }),
                        c.lmv_loader_promise = a,
                        c
                }
                if (this.getGeometry(a)) return b(Promise.resolve(), {
                    model: this.model,
                    fragId: a
                });
                var c = this.fragments.packIds ? this.fragments.packIds[a] : a;
                if (!this.pagingProxy || !this.pagingProxy.promisePackFile) return b(Promise.reject({
                    reason: "Not supported"
                }));
                var d = this.pagingProxy.promisePackFile(c);
                return d.hasOwnProperty("lmv_promise_count") || (d.lmv_promise_count = 0),
                    ++d.lmv_promise_count,
                    this.pagingProxy.pageOut(!1, !1),
                    b(d, {
                        model: this.model,
                        fragId: a
                    })
            },
            d.prototype.cancelPromisedGeometry = function(a) {
                if (!a) return ! 1;
                var b = a.lmv_loader_promise;
                return !! b && ( !! a.lmv_geom_canceled || (a.lmv_geom_canceled = !0, b.hasOwnProperty("lmv_promise_count") && --b.lmv_promise_count <= 0 && this.pagingProxy && this.pagingProxy.promisePackFile && this.pagingProxy.cancelPromisedPackFile(b), !0))
            },
            d.prototype.setMesh = function(a, b, c) {
                if (this.vizmeshes) {
                    var d = this.vizmeshes[a];
                    d && d.parent && d.parent.remove(d)
                }
                if (this.vizflags.length <= a) {
                    this.isFixedSize && (THREE.warn("Attempting to resize a fragments list that was initialized with fixed data. This will have a performance impact."), this.isFixedSize = !1);
                    var e = Math.ceil(1.5 * this.vizflags.length);
                    this.useThreeMesh && e < this.vizmeshes.length && (e = this.vizmeshes.length);
                    var f = new Uint16Array(e);
                    if (f.set(this.vizflags), this.vizflags = f, this.transforms) {
                        var g = new Float32Array(12 * e);
                        g.set(this.transforms),
                            this.transforms = g
                    }
                    if (this.boxes) {
                        var h = new Float32Array(6 * e);
                        h.set(this.boxes),
                            this.boxes = h
                    }
                    if (this.geomids) {
                        var j = new Int32Array(e);
                        j.set(this.geomids),
                            this.geomids = j
                    }
                    if (this.materialids) {
                        var k = new Int32Array(e);
                        k.set(this.materialids),
                            this.materialids = k
                    }
                }
                if (this.useThreeMesh) {
                    var l = new THREE.Mesh(b.geometry, b.material);
                    b.matrix && (l.matrix && l.matrix.copy(b.matrix), l.matrixWorld.copy(b.matrix)),
                        l.is2d = b.is2d,
                        l.isLine = b.isLine,
                        l.isWideLine = b.isWideLine,
                        l.isPoint = b.isPoint,
                        l.matrixAutoUpdate = !1,
                        l.frustumCulled = !1,
                        l.fragId = a,
                        l.dbId = 0 | this.fragments.fragId2dbId[a],
                        l.modelId = this.model.getModelId(),
                        this.vizmeshes[a] = l
                } else this.geomids[a] = b.geometry.svfid,
                    this.materialids[a] = b.material.id,
                this.materialmap[b.material.id] || (this.materialmap[b.material.id] = b.material);
                var m = 0;
                if (b.isLine ? m = i.MESH_ISLINE: b.isWideLine ? m = i.MESH_ISWIDELINE: b.isPoint && (m = i.MESH_ISPOINT), this.isFixedSize ? this.vizflags[a] |= m: this.vizflags[a] |= i.MESH_VISIBLE | m, c) {
                    var n = b.matrix,
                        o = 12 * a,
                        p = n.elements,
                        q = this.transforms;
                    q[o] = p[0],
                        q[o + 1] = p[1],
                        q[o + 2] = p[2],
                        q[o + 3] = p[4],
                        q[o + 4] = p[5],
                        q[o + 5] = p[6],
                        q[o + 6] = p[8],
                        q[o + 7] = p[9],
                        q[o + 8] = p[10],
                        q[o + 9] = p[12],
                        q[o + 10] = p[13],
                        q[o + 11] = p[14];
                    var r = new THREE.Box3;
                    b.geometry && b.geometry.boundingBox ? r.copy(b.geometry.boundingBox) : this.geoms.getModelBox(this.geomids[a], r),
                        r.applyMatrix4(n);
                    var s = 6 * a,
                        t = this.boxes;
                    t[s] = r.min.x,
                        t[s + 1] = r.min.y,
                        t[s + 2] = r.min.z,
                        t[s + 3] = r.max.x,
                        t[s + 4] = r.max.y,
                        t[s + 5] = r.max.z
                }
            },
            d.prototype.isFlagSet = function(a, b) {
                return !! (this.vizflags[a] & b)
            },
            d.prototype.setFlagFragment = function(a, b, c) {
                var d = this.vizflags[a];
                return !! (d & b) != c && (this.vizflags[a] = c ? d | b: d & ~b, !0)
            },
            d.prototype.setFlagGlobal = function(a, b) {
                var c = this.vizflags,
                    d = 0,
                    e = c.length;
                if (b) for (; d < e; d++) c[d] = c[d] | a;
                else for (var f = ~a; d < e; d++) c[d] = c[d] & f
            },
            d.prototype.hideLines = function(a) {
                this.hideFragments(i.MESH_ISLINE, a),
                    this.hideFragments(i.MESH_ISWIDELINE, a)
            },
            d.prototype.hidePoints = function(a) {
                this.hideFragments(i.MESH_ISPOINT, a)
            },
            d.prototype.hideFragments = function(a, b) {
                var c = i.MESH_HIDE,
                    d = this.vizflags,
                    e = 0,
                    f = d.length;
                if (b) for (; e < f; e++) d[e] & a && (d[e] = d[e] | c);
                else for (var g = ~c; e < f; e++) d[e] & a && (d[e] = d[e] & g);
                this.allVisibleDirty = !0
            },
            d.prototype.isFragVisible = function(a) {
                return 1 == (7 & this.vizflags[a])
            },
            d.prototype.isFragOff = function(a) {
                return !! (this.vizflags[a] & i.MESH_HIDE)
            },
            d.prototype.isLine = function(a) {
                return !! (this.vizflags[a] & i.MESH_ISLINE)
            },
            d.prototype.isWideLine = function(a) {
                return this.isFlagSet(a, i.MESH_ISWIDELINE)
            },
            d.prototype.isPoint = function(a) {
                return this.isFlagSet(a, i.MESH_ISPOINT)
            },
            d.prototype.areAllVisible = function() {
                if (this.allVisibleDirty) {
                    for (var a = this.vizflags,
                             b = !0,
                             c = 0,
                             d = a.length; c < d; c++) if (0 == (1 & a[c])) {
                        b = !1;
                        break
                    }
                    this.allVisible = b,
                        this.allVisibleDirty = !1
                }
                return this.allVisible
            };
        var j = function() {
            var a = null,
                b = null,
                c = parseInt("00FFFFFF", 16),
                d = parseInt("FF000000", 16);
            return function(f, g) {
                return a || (a = new THREE.Color, b = new THREE.Color),
                    a.set(f & c),
                    e(a),
                g && (b.setRGB(g.x, g.y, g.z), a.lerp(b, g.w)),
                e(a).getHex() | f & d
            }
        } ();
        d.prototype.getVizmesh = function() {
            function a() {
                d || (d = new THREE.Mesh(void 0, void 0, !0), d.isTemp = !0, d.dbId = 0, d.modelId = 0, d.fragId = -1, d.hide = !1, d.isLine = !1, d.isWideLine = !1, d.isPoint = !1, e = new THREE.MeshLambertMaterial({
                    color: 0,
                    depthWrite: !1,
                    emissive: 13421772
                }), e.cutplanes = null, g = new THREE.Box3, h = new THREE.Vector3, i = new THREE.Vector3, j = new Float32Array([1, -1, -1, -1, -1, -1, 1, 1, -1, -1, 1, -1, 1, 1, -1, -1, -1, -1, -1, -1, 1, 1, -1, 1, 1, 1, 1, 1, 1, 1, -1, 1, 1, -1, -1, 1, -1, -1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, -1, -1, 1, -1, -1, -1, 1, 1, -1, -1, 1, -1, 1, 1, 1, -1, 1, 1, 1, 1, 1, -1, 1, -1, -1, -1, -1, -1, -1, 1, -1, 1, 1, -1, 1, 1, -1, 1, -1, -1, -1, -1, 1, -1, 1, 1, -1, -1, 1, 1, 1, 1, 1, -1, 1, 1, 1, 1, -1, -1]), k = new THREE.BufferGeometry, k.addAttribute("position", new THREE.BufferAttribute(j, 3)))
            }
            function b(a, b, c, d) {
                var e = a * b,
                    f = d.boxes;
                c.min.x = f[e],
                    c.min.y = f[e + 1],
                    c.min.z = f[e + 2],
                    c.max.x = f[e + 3],
                    c.max.y = f[e + 4],
                    c.max.z = f[e + 5]
            }
            function c(a, c, d) {
                if (!d.boxTransform[c]) {
                    b(c, 6, g, d);
                    var e = new THREE.Matrix4;
                    i.subVectors(g.max, g.min),
                        i.multiplyScalar(.5),
                        e.makeScale(i.x, i.y, i.z),
                        h.addVectors(g.max, g.min),
                        h.multiplyScalar(.5);
                    var f = e.elements;
                    f[12] = h.x,
                        f[13] = h.y,
                        f[14] = h.z,
                        d.boxTransform[c] = e
                }
                a.geometry_proxy = k,
                    a.matrixWorld.copy(d.boxTransform[c])
            }
            var d, e, g, h, i, j, k;
            return function(b, g, h) {
                if (this.model.is2d() && f(this, b), this.useThreeMesh) return this.vizmeshes[b];
                a(),
                    this.getWorldMatrix(b, d.matrixWorld),
                    d.visible = !0,
                    d.hide = this.isFragOff(b),
                    d.fragId = b,
                    d.dbId = this.getDbIds(b),
                    d.themingColor = this.db2ThemingColor[d.dbId],
                    d.modelId = this.model.getModelId(),
                    d.geometry = this.getGeometry(b);
                var i = !1;
                if (!i) {
                    var j = this.pagingProxy ? this.pagingProxy.options.debug.boxProxyMaxCount: 0;
                    if (!d.geometry && this.boxCount < j) {
                        var k = this.pagingProxy ? this.pagingProxy.options.debug.boxProxyMinScreen: .1; (void 0 === g || 0 == g || void 0 !== g && g > k) && (i = !0)
                    }
                }
                return i ? (c(d, b, this), h || (d.geometry = d.geometry_proxy), this.boxCount++, d.material = e, d.isLine = !1, d.isWideLine = !1, d.isPoint = !1) : (d.material = this.getMaterial(b), d.isLine = this.isLine(b), d.isWideLine = this.isWideLine(b), d.isPoint = this.isPoint(b), d.geometry && this.boxTransform[b] && (this.boxTransform[b] = null)),
                    d
            }
        } (),
            d.prototype.promiseVizmesh = function(a) {
                return this.promiseGeometry(a)
            },
            d.prototype.cancelPromisedVizmesh = function(a) {
                return this.cancelPromisedGeometry(a)
            },
            d.prototype.getMaterialId = function(a) {
                return this.useThreeMesh ? this.vizmeshes[a].material.id: this.materialids[a]
            },
            d.prototype.getMaterial = function(a) {
                return this.useThreeMesh ? this.vizmeshes[a].material: this.materialmap[this.materialids[a]]
            },
            d.prototype.getGeometry = function(a) {
                var b;
                return this.useThreeMesh ? (b = this.vizmeshes[a]) ? b.geometry: null: this.geoms.getGeometry(this.geomids[a])
            },
            d.prototype.lockGeometry = function(a) {
                return !! this.useThreeMesh || this.geoms.lockGeometry(this.geomids[a])
            },
            d.prototype.unlockGeometry = function(a) {
                return !! this.useThreeMesh || this.geoms.unlockGeometry(this.geomids[a])
            },
            d.prototype.getLockCount = function(a) {
                return this.useThreeMesh ? 0 : this.geoms.getLockCount(this.geomids[a])
            },
            d.prototype.getGeometryId = function(a) {
                return this.useThreeMesh ? a: this.geomids[a]
            },
            d.prototype.setMaterial = function(a, b) {
                this.useThreeMesh ? this.vizmeshes[a].material = b: (this.materialids[a] = b.id, this.materialmap[b.id] = b)
            },
            d.prototype.getCount = function() {
                return this.vizflags.length
            },
            d.prototype.getDbIds = function(a) {
                return this.fragments.fragId2dbId[a]
            },
            d.prototype.dispose = function(a) {
                if (this.useThreeMesh) for (var b = {
                        type: "dispose"
                    },
                                                c = {
                                                    type: "removed"
                                                },
                                                d = 0; d < this.vizmeshes.length; d++) {
                    var e = this.vizmeshes[d];
                    e && (e.dispatchEvent(c), e.geometry.dispatchEvent(b))
                } else this.geoms.dispose(a)
            },
            d.prototype.setVisibility = function(a, b) {
                this.setFlagFragment(a, i.MESH_VISIBLE, b),
                    this.allVisibleDirty = !0
            },
            d.prototype.setFragOff = function(a, b) {
                this.setFlagFragment(a, i.MESH_HIDE, b),
                    this.allVisibleDirty = !0
            },
            d.prototype.setAllVisibility = function(a) {
                if (this.model.is2d()) {
                    var b = this.fragments;
                    if (b && b.dbId2fragId) for (var c in b.dbId2fragId) this.setObject2DGhosted(c, !a)
                } else this.setFlagGlobal(i.MESH_VISIBLE, a),
                    this.allVisible = a,
                    this.allVisibleDirty = !1
            },
            d.prototype.updateAnimTransform = function(a, b, c, d) {
                var e, f = this.animxforms;
                if (!f) {
                    var g = this.getCount();
                    f = this.animxforms = new Float32Array(10 * g);
                    for (var h = 0; h < g; h++) e = 10 * h,
                        f[e] = 1,
                        f[e + 1] = 1,
                        f[e + 2] = 1,
                        f[e + 3] = 0,
                        f[e + 4] = 0,
                        f[e + 5] = 0,
                        f[e + 6] = 1,
                        f[e + 7] = 0,
                        f[e + 8] = 0,
                        f[e + 9] = 0
                }
                e = 10 * a;
                var j = !1;
                b && (f[e] = b.x, f[e + 1] = b.y, f[e + 2] = b.z, j = !0),
                c && (f[e + 3] = c.x, f[e + 4] = c.y, f[e + 5] = c.z, f[e + 6] = c.w, j = !0),
                d && (f[e + 7] = d.x, f[e + 8] = d.y, f[e + 9] = d.z, j = !0),
                    this.setFlagFragment(a, i.MESH_MOVED, j),
                j || (f[e] = 1, f[e + 1] = 1, f[e + 2] = 1, f[e + 3] = 0, f[e + 4] = 0, f[e + 5] = 0, f[e + 6] = 1, f[e + 7] = 0, f[e + 8] = 0, f[e + 9] = 0)
            },
            d.prototype.getAnimTransform = function(a, b, c, d) {
                if (!this.animxforms) return ! 1;
                if (!this.isFlagSet(a, i.MESH_MOVED)) return ! 1;
                var e = 10 * a,
                    f = this.animxforms;
                return b && (b.x = f[e], b.y = f[e + 1], b.z = f[e + 2]),
                c && (c.x = f[e + 3], c.y = f[e + 4], c.z = f[e + 5], c.w = f[e + 6]),
                d && (d.x = f[e + 7], d.y = f[e + 8], d.z = f[e + 9]),
                    !0
            },
            d.prototype.getOriginalWorldMatrix = function(a, b) {
                var c = 12 * a,
                    d = b.elements,
                    e = this.transforms;
                if (e) d[0] = e[c],
                    d[1] = e[c + 1],
                    d[2] = e[c + 2],
                    d[3] = 0,
                    d[4] = e[c + 3],
                    d[5] = e[c + 4],
                    d[6] = e[c + 5],
                    d[7] = 0,
                    d[8] = e[c + 6],
                    d[9] = e[c + 7],
                    d[10] = e[c + 8],
                    d[11] = 0,
                    d[12] = e[c + 9],
                    d[13] = e[c + 10],
                    d[14] = e[c + 11],
                    d[15] = 1;
                else if (this.useThreeMesh) {
                    var f = this.getVizmesh(a);
                    f ? b.copy(f.matrixWorld) : b.identity()
                } else b.identity()
            },
            d.prototype.getWorldMatrix = function() {
                function a() {
                    b = new THREE.Matrix4,
                        c = new THREE.Vector3,
                        d = new THREE.Quaternion,
                        e = new THREE.Vector3
                }
                var b, c, d, e;
                return function(f, g) {
                    b || a(),
                        this.getOriginalWorldMatrix(f, g),
                    this.isFlagSet(f, i.MESH_MOVED) && (this.getAnimTransform(f, e, d, c), b.compose(c, d, e), g.multiplyMatrices(b, g))
                }
            } (),
            d.prototype.getWorldBounds = function() {
                function a() {
                    b = new THREE.Matrix4
                }
                var b;
                return function(c, d) {
                    if (b || a(), this.boxes && !this.isFlagSet(c, i.MESH_MOVED)) {
                        var e = this.boxes,
                            f = 6 * c;
                        return d.min.x = e[f],
                            d.min.y = e[f + 1],
                            d.min.z = e[f + 2],
                            d.max.x = e[f + 3],
                            d.max.y = e[f + 4],
                            void(d.max.z = e[f + 5])
                    }
                    if (this.useThreeMesh) {
                        var g = this.getVizmesh(c);
                        g && g.geometry && d.copy(g.geometry.boundingBox)
                    } else this.geoms.getModelBox(this.geomids[c], d);
                    d.empty() || (this.getWorldMatrix(c, b), d.applyMatrix4(b))
                }
            } (),
            d.prototype.setThemingColor = function(a, b) {
                this.db2ThemingColor[a] = b,
                    g(this, a)
            },
            d.prototype.clearThemingColors = function() {
                if (this.model.is2d()) for (var a = 1,
                                                b = this.fragments.dbId2fragId.length; a < b; a++) g(this, a);
                this.db2ThemingColor.length = 0
            },
            d.prototype.setObject2DGhosted = function(a, b) {
                this.dbIdIsGhosted[a] = b,
                    g(this, a)
            },
            d.prototype.setObject2DVisible = function(a, b) {
                this.dbIdIsHidden[a] = !b,
                    g(this, a)
            },
            d.prototype.getMemoryInfo = function() {
                return this.pagingProxy ? this.pagingProxy.getMemoryInfo() : null
            },
            h.prototype.getWorldMatrix = function(a) {
                this.frags.getWorldMatrix(this.fragId, a)
            },
            h.prototype.getOriginalWorldMatrix = function(a) {
                this.frags.getOriginalWorldMatrix(this.fragId, a)
            },
            h.prototype.getWorldBounds = function(a) {
                return this.frags.getWorldBounds(this.fragId, a)
            },
            h.prototype.getAnimTransform = function() {
                return this.scale || (this.scale = new THREE.Vector3(1, 1, 1), this.quaternion = new THREE.Quaternion(0, 0, 0, 1), this.position = new THREE.Vector3(0, 0, 0)),
                    this.frags.getAnimTransform(this.fragId, this.scale, this.quaternion, this.position)
            },
            h.prototype.updateAnimTransform = function() {
                this.scale || (this.scale = new THREE.Vector3(1, 1, 1), this.quaternion = new THREE.Quaternion(0, 0, 0, 1), this.position = new THREE.Vector3(0, 0, 0)),
                    this.frags.updateAnimTransform(this.fragId, this.scale, this.quaternion, this.position)
            },
            h.prototype.getMaterial = function() {
                return this.frags.getMaterial(this.fragId)
            },
            h.prototype.setMaterial = function(a) {
                return this.frags.setMaterial(this.fragId, a)
            },
            a.exports = {
                FragmentPointer: h,
                FragmentList: d
            }
    },
    function(a, b, c) {
        "use strict";
        function d(a, b, c) {
            var d = a.clone();
            return d.max(b),
                d.min(c),
                d.distanceToSquared(a)
        }
        function e(a, b, c, d) {
            var e = a.clone();
            return e.max(c),
                e.min(d),
                e.sub(a).dot(b)
        }
        function f() {
            function a(a, b, c) {
                var d = Math.ceil(Math.log2(a)),
                    e = Math.ceil(Math.log2(b));
                return Math.max(d, e) - Math.log2(c)
            }
            function b(a, b, c) {
                var d = b - c;
                d > 0 && (a.texWidth >>= d, a.texHeight >>= d, a.maxLevel = c)
            }
            this.urlPattern = null,
                this.tileSize = null,
                this.maxLevel = null,
                this.textureLoader = null,
                this.texWidth = 0,
                this.texHeight = 0,
                this.maxActiveTiles = h.isMobileDevice() ? 0 : 400,
                this.cacheSize = h.isMobileDevice() ? 0 : 150,
                this.onRootLoaded = null,
                this.levelOffset = 0,
                this.pixelRatio = 1,
                this.getRootTileSize = function() {
                    return 1 * (this.tileSize << this.maxLevel)
                },
                this.getQuadWidth = function() {
                    return 1 * this.texWidth / this.getRootTileSize()
                },
                this.getQuadHeight = function() {
                    return 1 * this.texHeight / this.getRootTileSize()
                },
                this.getPageToModelTransform = function(a, b) {
                    var c = a / this.getQuadWidth(),
                        d = b / this.getQuadHeight();
                    return new LmvMatrix4(!0).set(c, 0, 0, 0, 0, d, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
                },
                this.getBBox = function() {
                    var a = this.getQuadWidth(),
                        b = this.getQuadHeight(),
                        c = 1 - b;
                    return new THREE.Box3(new THREE.Vector3(0, c, 0), new THREE.Vector3(a, 1, 0))
                },
                this.valid = function() {
                    return "string" == typeof this.urlPattern && this.urlPattern.length > 0 && "number" == typeof this.tileSize && this.tileSize > 0 && "number" == typeof this.maxLevel && this.maxLevel > 0 && "number" == typeof this.texWidth && this.texWidth > 0 && "number" == typeof this.texHeight && this.texHeight > 0
                },
                this.initForSimpleImage = function(a, b) {
                    this.urlPattern = decodeURIComponent(a),
                        this.maxLevel = 0,
                        this.levelOffset = 0,
                        this.tileSize = -1,
                        this.texWidth = -1,
                        this.texHeight = -1,
                        this.onRootLoaded = b
                },
                this.initFromLoadOptions = function(c, d, e) {
                    this.urlPattern = decodeURIComponent(c),
                        this.textureLoader = e,
                    d && (this.tileSize = d.tileSize, this.maxLevel = a(d.texWidth, d.texHeight, d.tileSize), this.texWidth = d.texWidth, this.texHeight = d.texHeight, this.levelOffset = d.levelOffset, "number" == typeof d.maxLevel && b(this, this.maxLevel, d.maxLevel), this.maxActiveTiles = d.maxActiveTiles || this.maxActiveTiles, this.cacheSize = d.cacheSize || this.cacheSize)
                }
        }
        function g(a, b) {
            function c(a) {
                var b = L.maxLevel - a;
                return L.texWidth >> b
            }
            function f(a) {
                var b = L.maxLevel - a;
                return L.texHeight >> b
            }
            function g(a) {
                var b = c(a.level),
                    d = f(a.level),
                    e = a.x * L.tileSize,
                    g = a.y * L.tileSize;
                return e >= b || g >= d
            }
            function h(a) {
                var b = c(a.level),
                    d = f(a.level),
                    e = a.x * L.tileSize,
                    g = a.y * L.tileSize,
                    h = 1 * Math.max(0, Math.min(L.tileSize, b - e)),
                    i = 1 * Math.max(0, Math.min(L.tileSize, d - g)),
                    j = 1 * L.tileSize;
                return new THREE.Vector2(1 * h / j, i / j)
            }
            function o(a) {
                return 1 / (1 << a)
            }
            function p() {
                this.offsetX = 0,
                    this.offsetY = 0,
                    this.scaleX = 1,
                    this.scaleY = 1
            }
            function q(a, b) {
                var c = a.level - b.level,
                    d = 1 << c,
                    e = 1 / d,
                    f = e,
                    g = h(b);
                e /= g.x,
                    f /= g.y;
                var i = b.x * d,
                    j = b.y * d,
                    k = a.x - i,
                    l = a.y - j,
                    m = h(a);
                k *= e,
                    l *= f,
                    l = 1 - l - f * m.y;
                var n = new p;
                return n.offsetX = k,
                    n.offsetY = l,
                    n.scaleX = e * m.x,
                    n.scaleY = f * m.y,
                    n
            }
            function r(a) {
                return o(a.level) * a.x
            }
            function s(a) {
                return o(a.level) * ((1 << a.level) - 1 - a.y)
            }
            function t(a) {
                return Q[i.tile2Index(a)]
            }
            function u(a) {
                var b = t(a);
                return b instanceof n && b.state == m
            }
            function v(a, b) {
                for (var c = a.getParent(); c;) {
                    var d = t(c),
                        e = d && d.state == m;
                    if (e && b && d.mesh.material.map.needsUpdate && c.level > 0 && (e = !1), e) break;
                    c = c.getParent()
                }
                return c
            }
            function w(a, b) {
                var c = b || $,
                    d = [];
                d.push(new THREE.Vector2(c.offsetX, c.offsetY)),
                    d.push(new THREE.Vector2(c.offsetX + c.scaleX, c.offsetY)),
                    d.push(new THREE.Vector2(c.offsetX + c.scaleX, c.offsetY + c.scaleY)),
                    d.push(new THREE.Vector2(c.offsetX, c.offsetY + c.scaleY)),
                    a.faceVertexUvs[0].length = 0,
                    a.faceVertexUvs[0].push([d[0], d[1], d[2]]),
                    a.faceVertexUvs[0].push([d[0], d[2], d[3]]),
                    a.uvsNeedUpdate = !0
            }
            function x(a) {
                var b = new THREE.Geometry;
                return b.vertices.push(new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 0, 0), new THREE.Vector3(1, 1, 0), new THREE.Vector3(0, 1, 0)),
                    b.faces.push(new THREE.Face3(0, 1, 2)),
                    b.faces.push(new THREE.Face3(0, 2, 3)),
                    w(b, a),
                    b.computeFaceNormals(),
                    b
            }
            function y(a) {
                var b = Y[Z];
                return b ? w(b, a) : (b = x(a), Y[Z] = b),
                    Z++,
                    b
            }
            function z(a, b, c) {
                var d;
                if (b) X || (X = x()),
                    d = X;
                else {
                    var e = v(a);
                    b = C(e).material;
                    d = y(q(a, e, c))
                }
                var f = new THREE.Mesh(d, b),
                    g = o(a.level),
                    i = h(a),
                    j = (1 - i.y) * g,
                    k = r(a),
                    l = s(a);
                return f.position.set(k, l + j, 0),
                    f.scale.set(g * i.x, g * i.y, 1),
                    f
            }
            function A(a) {
                var b = L.levelOffset ? L.levelOffset: 0;
                return L.urlPattern.replace("{x}", a.x).replace("{y}", a.y).replace("{z}", a.level + b)
            }
            function B(b) {
                var c = i.tile2Index(b),
                    d = Q[c];
                if (!d || d.state == k) {
                    d || (d = new n(R), Q[c] = d),
                        d.state = l;
                    var e = A(b),
                        f = function(c) {
                            if (_) {
                                0 == L.maxLevel && ( - 1 == L.texWidth && (L.texWidth = c.image.width), -1 == L.texHeight && (L.texHeight = c.image.height), -1 == L.tileSize && (L.tileSize = Math.max(c.image.width, c.image.height)), M = a.getBBox()),
                                    c.minFilter = THREE.LinearFilter,
                                    c.magFilter = THREE.LinearFilter;
                                var f = new THREE.MeshBasicMaterial({
                                    color: 4294967295
                                });
                                f.map = c,
                                    f.name = e,
                                    f.disableEnvMap = !0,
                                e.toLowerCase().indexOf(".png") && (f.transparent = !0, f.alphaTest = .01),
                                    O.addMaterial(f.name, f, !0);
                                var g = z(b, f);
                                d.mesh = g,
                                    d.state = m,
                                    U--,
                                    V = !0;
                                var h = c && c.image ? c.image.src: null;
                                h && THREE.Cache && THREE.Cache.get(h) && THREE.Cache.remove(h),
                                0 == b.level && L.onRootLoaded && L.onRootLoaded()
                            }
                        };
                    U++,
                        L.textureLoader(e,
                            function(a) {
                                f(a)
                            },
                            function(a) {
                                console.error(a)
                            })
                }
            }
            function C(a) {
                var b = i.tile2Index(a),
                    c = Q[b];
                return c && c.state == m ? c.mesh: null
            }
            function D(a, b) {
                var c = r(a),
                    d = s(a);
                b.set(c, d, 0)
            }
            function E(a, b) {
                var c = o(a.level),
                    d = r(a) + c,
                    e = s(a) + c;
                b.set(d, e, 0)
            }
            function F(a, b) {
                this.tile = a,
                    this.prio = b
            }
            function G(a, b) {
                return a.prio > b.prio
            }
            function H(a) {
                var b = Q[i.tile2Index(a)];
                b && b.timeStamp != R && (b.timeStamp = R, S++)
            }
            function I(a, b, c) {
                a.sort(function(a, d) {
                    var e = ba(a, b, c);
                    return ba(d, b, c) - e
                });
                for (var d = 0,
                         e = 0; e < a.length; e++) {
                    var f = t(a[e]);
                    if (!f || f.state != l) {
                        if (U >= T) break;
                        B(a[e]),
                            d++
                    }
                }
                return d
            }
            function J(a) {
                if (a && a.mesh && a.mesh.material) {
                    var b = a.mesh.material;
                    O.removeMaterial(b.name),
                        b.map.dispose(),
                        b.map.needsUpdate = !0;
                    var c = {
                        type: "dispose"
                    };
                    b.dispatchEvent(c),
                        b.needsUpdate = !0
                }
            }
            function K(a, b, c) {
                var d = Object.keys(Q),
                    e = d.length,
                    f = L.cacheSize - e,
                    g = a - f;
                if (! (g <= 0)) {
                    d.sort(function(a, d) {
                        var e = Q[a].timeStamp,
                            f = Q[d].timeStamp;
                        if (e != f) return e - f;
                        var g = i.index2Tile(a),
                            h = i.index2Tile(d);
                        return ba(g, b, c) - ba(h, b, c)
                    });
                    for (var h = Math.min(g, d.length), j = 0; j < h; j++) {
                        var k = d[j];
                        if (0 !== i.index2Tile(k).level && Q[k].state == m) {
                            if (Q[k].timeStamp == R) break;
                            J(Q[k]),
                                delete Q[k]
                        }
                    }
                }
            }
            var L = a,
                M = a.getBBox(),
                N = new THREE.Scene,
                O = b,
                P = !0,
                Q = [],
                R = 0,
                S = 0,
                T = 5,
                U = 0,
                V = !1,
                W = [],
                X = null,
                Y = [],
                Z = 0;
            this.nextBatch = function() {
                return P ? null: (P = !0, N)
            },
                this.getSceneCount = function() {
                    return 1
                },
                this.done = function() {
                    return P
                },
                this.rayCast = function(a, b) {
                    return null
                },
                this.getVisibleBounds = function(a, b) {
                    a && a.copy(M),
                    b && b.copy(M)
                };
            var $ = new p,
                _ = this;
            B(new i.TileCoords(0, 0, 0));
            var aa = function() {
                    var a = new THREE.Vector3,
                        b = new THREE.Vector3,
                        c = new THREE.Box3;
                    return function(d, e) {
                        return D(d, a),
                            E(d, b),
                            c.set(a, b),
                        e.intersectsBox(c) > 0
                    }
                } (),
                ba = function() {
                    var a = new THREE.Vector3,
                        b = new THREE.Vector3;
                    return function(c, e, f) {
                        var g = o(c.level);
                        D(c, a),
                            E(c, b);
                        var h = d(f, a, b),
                            i = aa(c, e),
                            j = i ? 100 : 1;
                        return h = Math.max(h, 1e-4),
                        j * (g * g) / h
                    }
                } (),
                ca = function() {
                    var a = new THREE.Vector3,
                        b = new THREE.Vector3;
                    return function(c, d, f, g, h) {
                        D(c, a),
                            E(c, b);
                        var i = e(d, f, a, b);
                        return (b.x - a.x) / (Math.tan(THREE.Math.degToRad(g / 2)) * i) * .5 * h
                    }
                } ();
            this.dispose = function() {
                var a;
                for (a in Q) J(Q[a]);
                for (X && (X.dispose(), X.needsUpdate = !0), a = 0; a < Y.length; a++) {
                    var b = Y[a];
                    b && (b.dispose(), b.needsUpdate = !0)
                }
            },
                this.dtor = function() {
                    this.dispose(),
                        _ = null,
                        O = null
                },
                this.reset = function(a, b) {
                    var c, d;
                    for (c = 0; c < N.children.length; c++) {
                        N.children[c].dispatchEvent({
                            type: "removed"
                        })
                    }
                    if (N.children.length = 0, R++, S = 0, Z = 0, !u(new i.TileCoords(0, 0, 0))) return void(P = !0);
                    var e = new j(G),
                        f = new i.TileCoords(0, 0, 0),
                        h = ba(f, a, b.position);
                    e.add(new F(f, h));
                    for (var k = b.getWorldDirection(), l = 0 | b.clientHeight * L.pixelRatio, m = [], n = [], o = []; e.size() > 0;) {
                        if (d = e.get(0).tile, e.removeAt(0), !g(d)) {
                            var p = !0;
                            d.level == L.maxLevel && (p = !1);
                            ca(d, b.position, k, b.fov, l) < L.tileSize && (p = !1);
                            var q = aa(d, a);
                            if (q && (u(d) || o.push(d), H(d)), !q && m.length + n.length > L.maxActiveTiles && (p = !1), p) for (var r = 0; r < 4; r++) {
                                var s = d.getChild(r);
                                h = ba(s, a, b.position),
                                    e.add(new F(s, h))
                            } else q ? m.push(d) : n.push(d)
                        }
                    }
                    var t = 0;
                    V = !1;
                    var v = !0;
                    for (c = 0; c < m.length; ++c) {
                        d = m[c];
                        var w = C(d);
                        w && w.material.map.needsUpdate && (t < 5 ? t++:(w = z(d, null, !0), V = !0, v = !1)),
                        w || (w = z(d, null), v = !1),
                            N.add(w)
                    }
                    P = !1;
                    var x = I(o, a, b.position);
                    S += U;
                    var y = [];
                    for (c = 0; c < n.length && !(S >= L.maxActiveTiles); c++) if (d = n[c], u(d)) for (var A = 0; A <= d.level; A++) {
                        var B = d.getParentAtLevel(A);
                        if (H(B), S > L.maxActiveTiles) break
                    } else y.push(d),
                        S++;
                    if (x += I(y, a, b.position), K(x, a, b.position), v && W.length > 0) {
                        var D = W.splice(0, W.length);
                        setTimeout(function() {
                                for (var a = 0; a < D.length; a++) D[a]()
                            },
                            1)
                    }
                },
                this.callWhenRefined = function(a) {
                    W.push(a)
                },
                this.update = function() {
                    return V
                }
        }
        var h = c(71),
            i = c(120),
            j = c(116),
            k = 0,
            l = 1,
            m = 2,
            n = function(a, b) {
                this.timeStamp = a,
                    this.mesh = b,
                    this.state = k
            };
        a.exports = {
            ModelIteratorTexQuad: g,
            TexQuadConfig: f
        }
    },
    function(a, b) {
        "use strict";
        function c(a, b, c) {
            this.level = a,
                this.x = b,
                this.y = c
        }
        c.prototype = {
            constructor: c,
            copy: function() {
                return new c(level, x, y)
            },
            isValid: function() {
                return Number.isInteger(this.level) && this.level >= 0 && Number.isInteger(this.x) && Number.isInteger(this.y)
            },
            getChild: function(a) {
                var b = 1 & a ? 1 : 0,
                    d = 2 & a ? 1 : 0;
                return new c(this.level + 1, 2 * this.x + b, 2 * this.y + d)
            },
            getParent: function() {
                return 0 == this.level ? null: new c(this.level - 1, Math.floor(this.x / 2), Math.floor(this.y / 2))
            },
            getParentAtLevel: function(a) {
                if (a < 0 || a > this.level) return null;
                var b = this.level - a;
                return new c(a, Math.floor(this.x >> b), Math.floor(this.y >> b))
            },
            toString: function() {
                return "(" + this.level + ", " + this.x + ", " + this.y + ")"
            },
            equals: function(a, b, d) {
                return a instanceof c ? this.equals(a.level, a.x, a.y) : this.level === a && this.x === b && this.y === d
            }
        };
        var d = function(a) {
                var b = ((1 << 2 * a.level) - 1) / 3,
                    c = 1 << a.level;
                return b + a.y * c + a.x
            },
            e = function(a) {
                for (var b = new c(0, 0, 0); d(b) <= a;) b.level++;
                b.level--;
                var e = a - d(b),
                    f = 1 << b.level;
                return b.y = Math.floor(e / f),
                    b.x = e % f,
                    b
            };
        a.exports = {
            TileCoords: c,
            tile2Index: d,
            index2Tile: e
        }
    },
    function(a, b, c) {
        "use strict";
        function d(a, b) {
            if (!a || !a.colors) return new THREE.Color(1, 0, 0);
            var c = a.colors[b];
            if (!c) return new THREE.Color(0, 0, 0);
            var d = c.values;
            if (!d || !d.length) return new THREE.Color(1, 0, 0);
            var e = d[0];
            return new THREE.Color(e.r, e.g, e.b)
        }
        function e(a, b, c) {
            if (!a || !a.scalars) return c;
            var d = a.scalars[b];
            return d ? d.values[0] : c
        }
        function f(a, b, c) {
            if (!a || !a.booleans) return c;
            var d = a.booleans;
            return d ? d[b] : c
        }
        function g(a, b, c, d) {
            if (!a || !a[b]) return d;
            var e = a[b][c];
            return e ? e.values[0] : d
        }
        function h(a, b, c) {
            var d = {
                bands: 0,
                weights: new THREE.Vector4(1, 1, 1, 1),
                frequencies: new THREE.Vector4(1, 1, 1, 1)
            };
            if (!a || !a[b]) return d;
            var e = a[b][c];
            if (! (e && e.values && e.values instanceof Array)) return d;
            var f = e.values;
            d.bands = f.length / 2;
            for (var g = 0; g < d.bands; ++g) d.frequencies.setComponent(g, 1 / f[2 * g]),
                d.weights.setComponent(g, f[2 * g + 1]);
            return d
        }
        function i(a, b, c, d) {
            if (!a || !a.scalars) return d;
            var e = a.scalars[b];
            return e ? m(e.values[0], e.units, c) : d
        }
        function j(a, b, c, d) {
            if (!a || !a[b]) return d;
            var e = a[b][c];
            return e && e.connections ? e.connections[0] : d
        }
        function k(a) {
            var b = a;
            return b <= .04045 ? b /= 12.92 : b = Math.pow((b + .055) / 1.055, 2.4),
                b
        }
        function l(a) {
            var b, c, d;
            return b = k(a.r),
                c = k(a.g),
                d = k(a.b),
                new THREE.Color(b, c, d)
        }
        function m(a, b, c) {
            var d = B[c];
            d || (d = 1, THREE.warn("Unsupported unit: " + c));
            var e = B[b];
            return e || (e = 1, THREE.warn("Unsupported unit: " + b)),
            a * d / e
        }
        function n(a, b, c) {
            if (0 === b) {
                var d = i(a, "bumpmap_Depth", c, 0),
                    e = 1,
                    f = 1;
                return null != g(a, "scalars", "texture_RealWorldScale") ? e = f = i(a, "texture_RealWorldScale", c, 1) : (e = i(a, "texture_RealWorldScaleX", c, 1), f = i(a, "texture_RealWorldScaleY", c, 1)),
                    e = 0 === e ? 1 : 1 / e,
                    f = 0 === f ? 1 : 1 / f,
                    new THREE.Vector2(e * d, f * d)
            }
            var h = g(a, "scalars", "bumpmap_NormalScale", 1);
            return new THREE.Vector2(h, h)
        }
        function o(a, b) {
            var c = i(a, "texture_RealWorldOffsetX", b, 0),
                d = i(a, "texture_RealWorldOffsetY", b, 0),
                e = g(a, "scalars", "texture_UOffset", 0),
                f = g(a, "scalars", "texture_VOffset", 0),
                h = 1,
                j = 1;
            null != g(a, "scalars", "texture_RealWorldScale") ? h = j = i(a, "texture_RealWorldScale", b, 1) : (h = i(a, "texture_RealWorldScaleX", b, 1), j = i(a, "texture_RealWorldScaleY", b, 1)),
                h = 0 === h ? 1 : h,
                j = 0 === j ? 1 : j;
            var k = g(a, "scalars", "texture_UScale", 1),
                l = g(a, "scalars", "texture_VScale", 1),
                m = g(a, "scalars", "texture_WAngle", 1);
            m *= Math.PI / 180;
            var n = Math.cos(m),
                o = Math.sin(m),
                p = k / h,
                q = l / j;
            return {
                elements: [n * p, o * p, 0, -o * q, n * q, 0, -n * p * c + o * q * d + e, -o * p * c - n * q * d + f, 1]
            }
        }
        function p() {
            var a = [0, 128, 64, 191, 32, 160, 96, 223, 16, 143, 80, 207, 48, 175, 112, 239, 8, 135, 72, 199, 40, 167, 103, 231, 25, 151, 88, 215, 56, 183, 120, 250],
                b = new Uint8Array(a),
                c = new THREE.DataTexture(b, 32, 1, THREE.LuminanceFormat, THREE.UnsignedByteType, THREE.UVMapping, THREE.RepeatWrapping, THREE.RepeatWrapping, THREE.NearestFilter, THREE.NearestFilter, 0);
            c.generateMipmaps = !1,
                c.flipY = !1,
                c.needsUpdate = !0;
            for (var d, e, f = function(a, b) {
                    return Math.atan2(a * b, Math.sqrt(a * a + b * b + 1))
                },
                     g = new Uint8Array(16384), h = 0; h < 128; ++h) for (var i = 0; i < 128; ++i) {
                d = h / 128 * 2 - 1,
                    e = i / 128 * 2 - 1,
                    d = Math.min(Math.max(1 / 128 - 1, d), 1 - 1 / 128),
                    e = Math.min(Math.max(1 / 128 - 1, e), 1 - 1 / 128);
                var j = d - 1 / 128,
                    k = d + 1 / 128,
                    l = e - 1 / 128,
                    m = e + 1 / 128,
                    n = f(k, m) - f(j, m) - f(k, l) + f(j, l);
                g[128 * h + i] = 1e6 * n
            }
            var o = new THREE.DataTexture(g, 128, 128, THREE.LuminanceFormat, THREE.UnsignedByteType, THREE.UVMapping, THREE.RepeatWrapping, THREE.RepeatWrapping, THREE.NearestFilter, THREE.NearestFilter, 0);
            o.generateMipmaps = !1,
                o.flipY = !1,
                o.needsUpdate = !0,
                y = {
                    randomNum: c,
                    solidAngle: o
                }
        }
        function q() {
            var a = [151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180],
                b = new Uint8Array(a),
                c = new THREE.DataTexture(b, 256, 1, THREE.LuminanceFormat, THREE.UnsignedByteType, THREE.UVMapping, THREE.RepeatWrapping, THREE.RepeatWrapping, THREE.NearestFilter, THREE.NearestFilter, 0);
            c.generateMipmaps = !1,
                c.flipY = !1,
                c.needsUpdate = !0;
            var d = [225, 39, 122, 231, 29, 173, 15, 159, 75, 88, 233, 19, 179, 79, 72, 94, 54, 73, 151, 161, 171, 113, 221, 144, 127, 83, 168, 19, 88, 122, 62, 225, 109, 128, 246, 247, 172, 101, 61, 139, 211, 168, 64, 210, 224, 82, 87, 97, 119, 250, 201, 44, 242, 239, 154, 99, 126, 13, 44, 70, 246, 170, 100, 52, 135, 28, 187, 22, 207, 119, 199, 1, 235, 187, 55, 131, 190, 124, 222, 249, 236, 53, 225, 231, 71, 30, 173, 185, 153, 47, 79, 133, 225, 10, 140, 62, 17, 99, 100, 29, 137, 95, 142, 244, 76, 5, 83, 124, 38, 216, 253, 195, 44, 210, 148, 185, 188, 39, 78, 195, 132, 30, 60, 73, 92, 223, 133, 80, 230, 56, 118, 207, 79, 15, 251, 211, 111, 21, 79, 23, 240, 146, 150, 207, 3, 61, 103, 27, 148, 6, 31, 127, 235, 58, 173, 244, 116, 81, 34, 120, 192, 213, 188, 226, 97, 23, 16, 161, 106, 80, 242, 148, 35, 37, 91, 117, 51, 216, 97, 193, 126, 222, 39, 38, 133, 217, 215, 23, 237, 57, 205, 42, 222, 165, 126, 133, 33, 8, 227, 154, 27, 18, 56, 11, 192, 120, 80, 92, 236, 38, 210, 207, 128, 31, 135, 39, 123, 5, 49, 127, 107, 200, 34, 14, 153, 239, 134, 19, 248, 162, 58, 201, 159, 198, 243, 158, 72, 5, 138, 184, 222, 200, 34, 141, 233, 40, 195, 238, 191, 122, 171, 32, 66, 254, 229, 197],
                e = new Uint8Array(d),
                f = new THREE.DataTexture(e, 256, 1, THREE.LuminanceFormat, THREE.UnsignedByteType, THREE.UVMapping, THREE.RepeatWrapping, THREE.RepeatWrapping, THREE.NearestFilter, THREE.NearestFilter, 0);
            f.generateMipmaps = !1,
                f.flipY = !1,
                f.needsUpdate = !0;
            for (var g, h, i, j, k, l, m, n, o = function(b) {
                    return a[b % 256]
                },
                     p = new Array(262144), q = 0; q < 256; ++q) for (n = 0; n < 256; ++n) g = o(n) + q,
                h = o(g),
                i = o(g + 1),
                j = o(n + 1) + q,
                k = o(j),
                l = o(j + 1),
                m = 4 * (256 * q + n),
                p[m] = h,
                p[m + 1] = i,
                p[m + 2] = k,
                p[m + 3] = l;
            var r = new Uint8Array(p),
                s = new THREE.DataTexture(r, 256, 256, THREE.RGBAFormat, THREE.UnsignedByteType, THREE.UVMapping, THREE.RepeatWrapping, THREE.RepeatWrapping, THREE.NearestFilter, THREE.NearestFilter, 0);
            s.generateMipmaps = !1,
                s.flipY = !1,
                s.needsUpdate = !0;
            var t = [1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1, 0, 1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, -1, 0, 1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1, 1, 1, 0, 0, -1, 1, -1, 1, 0, 0, -1, -1],
                u = new Array(1024);
            for (n = 0; n < 256; ++n) {
                var v = a[n] % 16;
                u[4 * n] = 127 * t[3 * v] + 128,
                    u[4 * n + 1] = 127 * t[3 * v + 1] + 128,
                    u[4 * n + 2] = 127 * t[3 * v + 2] + 128,
                    u[4 * n + 3] = 0
            }
            var w = new Uint8Array(u),
                x = new THREE.DataTexture(w, 256, 1, THREE.RGBAFormat, THREE.UnsignedByteType, THREE.UVMapping, THREE.RepeatWrapping, THREE.RepeatWrapping, THREE.NearestFilter, THREE.NearestFilter, 0);
            x.generateMipmaps = !1,
                x.flipY = !1,
                x.needsUpdate = !0,
                z = {
                    permutation: c,
                    gradient: f,
                    perm2D: s,
                    permGrad: x
                }
        }
        function r(a, b, c) {
            a[c + "_enable"] = g(b, "booleans", c + "_enable", 0);
            var d = h(b, "scalars", c + "_prof");
            a[c + "_bands"] = d.bands,
                a[c + "_weights"] = d.weights,
                a[c + "_frequencies"] = d.frequencies
        }
        function s(a, b, c) {
            var h, i, k = a.materials,
                m = k[a.userassets[0]],
                n = m.properties,
                o = b ? A.createPrismMaterial() : new THREE.MeshPhongMaterial;
            if (o.proteinMat = a, o.packedNormals = !0, m && b) {
                o.tag = m.tag,
                    o.prismType = m.definition,
                void 0 === o.prismType && (o.prismType = ""),
                void 0 !== a.IsSingleSided && !1 === a.IsSingleSided && (o.side = THREE.DoubleSide);
                var s = o.mapList;
                switch (o.transparent = !1, o.envExponentMin = 1, o.envExponentMax = 512, o.envExponentCount = 10, o.surface_albedo = l(d(n, "surface_albedo", new THREE.Color(1, 0, 0))), s.surface_albedo_map = j(n, "colors", "surface_albedo", null), o.surface_anisotropy = g(n, "scalars", "surface_anisotropy", 0), s.surface_anisotropy_map = j(n, "scalars", "surface_anisotropy", null), o.surface_rotation = g(n, "scalars", "surface_rotation", 0), s.surface_rotation_map = j(n, "scalars", "surface_rotation", null), o.surface_roughness = g(n, "scalars", "surface_roughness", 0), s.surface_roughness_map = j(n, "scalars", "surface_roughness", null), s.surface_cutout_map = j(n, "textures", "surface_cutout", null), s.surface_normal_map = j(n, "textures", "surface_normal", null), null != s.surface_cutout_map && (o.side = THREE.DoubleSide, o.transparent = !0), o.prismType) {
                    case "PrismOpaque":
                        o.opaque_albedo = l(d(n, "opaque_albedo", new THREE.Color(1, 0, 0))),
                            s.opaque_albedo_map = j(n, "colors", "opaque_albedo", null),
                            o.opaque_luminance_modifier = l(d(n, "opaque_luminance_modifier", new THREE.Color(0, 0, 0))),
                            s.opaque_luminance_modifier_map = j(n, "colors", "opaque_luminance_modifier", null),
                            o.opaque_f0 = g(n, "scalars", "opaque_f0", 0),
                            s.opaque_f0_map = j(n, "scalars", "opaque_f0", null),
                            o.opaque_luminance = g(n, "scalars", "opaque_luminance", 0);
                        break;
                    case "PrismMetal":
                        o.metal_f0 = l(d(n, "metal_f0", new THREE.Color(1, 0, 0))),
                            s.metal_f0_map = j(n, "colors", "metal_f0", null);
                        break;
                    case "PrismLayered":
                        o.layered_bottom_f0 = l(d(n, "layered_bottom_f0", new THREE.Color(1, 1, 1))),
                            s.layered_bottom_f0_map = j(n, "colors", "layered_bottom_f0", null),
                            o.layered_diffuse = l(d(n, "layered_diffuse", new THREE.Color(1, 0, 0))),
                            s.layered_diffuse_map = j(n, "colors", "layered_diffuse", null),
                            o.layered_anisotropy = g(n, "scalars", "layered_anisotropy", 0),
                            s.layered_anisotropy_map = j(n, "scalars", "layered_anisotropy", null),
                            o.layered_f0 = g(n, "scalars", "layered_f0", 0),
                            s.layered_f0_map = j(n, "scalars", "layered_f0", null),
                            o.layered_fraction = g(n, "scalars", "layered_fraction", 0),
                            s.layered_fraction_map = j(n, "scalars", "layered_fraction", null),
                            o.layered_rotation = g(n, "scalars", "layered_rotation", 0),
                            s.layered_rotation_map = j(n, "scalars", "layered_rotation", null),
                            o.layered_roughness = g(n, "scalars", "layered_roughness", 0),
                            s.layered_roughness_map = j(n, "scalars", "layered_roughness", null),
                            s.layered_normal_map = j(n, "textures", "layered_normal", null);
                        break;
                    case "PrismTransparent":
                        o.transparent_color = l(d(n, "transparent_color", new THREE.Color(1, 0, 0))),
                            o.transparent_distance = g(n, "scalars", "transparent_distance", 0),
                            o.transparent_ior = g(n, "scalars", "transparent_ior", 0),
                            o.transparent = !0;
                        break;
                    case "PrismWood":
                        r(o, n, "wood_fiber_cosine"),
                            r(o, n, "wood_fiber_perlin"),
                            o.wood_fiber_perlin_scale_z = g(n, "scalars", "wood_fiber_perlin_scale_z", 0),
                            r(o, n, "wood_growth_perlin"),
                            o.wood_latewood_ratio = g(n, "scalars", "wood_latewood_ratio", 0),
                            o.wood_earlywood_sharpness = g(n, "scalars", "wood_earlywood_sharpness", 0),
                            o.wood_latewood_sharpness = g(n, "scalars", "wood_latewood_sharpness", 0),
                            o.wood_ring_thickness = g(n, "scalars", "wood_ring_thickness", 0),
                            r(o, n, "wood_earlycolor_perlin"),
                            o.wood_early_color = l(d(n, "wood_early_color", new THREE.Color(1, 0, 0))),
                            o.wood_use_manual_late_color = g(n, "booleans", "wood_use_manual_late_color", 0),
                            o.wood_manual_late_color = l(d(n, "wood_manual_late_color", new THREE.Color(1, 0, 0))),
                            r(o, n, "wood_latecolor_perlin"),
                            o.wood_late_color_power = g(n, "scalars", "wood_late_color_power", 0),
                            r(o, n, "wood_diffuse_perlin"),
                            o.wood_diffuse_perlin_scale_z = g(n, "scalars", "wood_diffuse_perlin_scale_z", 0),
                            o.wood_use_pores = g(n, "booleans", "wood_use_pores", 0),
                            o.wood_pore_type = g(n, "choicelists", "wood_pore_type", 0),
                            o.wood_pore_radius = g(n, "scalars", "wood_pore_radius", 0),
                            o.wood_pore_cell_dim = g(n, "scalars", "wood_pore_cell_dim", 0),
                            o.wood_pore_color_power = g(n, "scalars", "wood_pore_color_power", 0),
                            o.wood_pore_depth = g(n, "scalars", "wood_pore_depth", 0),
                            o.wood_use_rays = g(n, "booleans", "wood_use_rays", 0),
                            o.wood_ray_color_power = g(n, "scalars", "wood_ray_color_power", 0),
                            o.wood_ray_seg_length_z = g(n, "scalars", "wood_ray_seg_length_z", 0),
                            o.wood_ray_num_slices = g(n, "integers", "wood_ray_num_slices", 0),
                            o.wood_ray_ellipse_z2x = g(n, "scalars", "wood_ray_ellipse_z2x", 0),
                            o.wood_ray_ellipse_radius_x = g(n, "scalars", "wood_ray_ellipse_radius_x", 0),
                            o.wood_use_latewood_bump = g(n, "booleans", "wood_use_latewood_bump", 0),
                            o.wood_latewood_bump_depth = g(n, "scalars", "wood_latewood_bump_depth", 0),
                            o.wood_use_groove_roughness = g(n, "booleans", "wood_use_groove_roughness", 0),
                            o.wood_groove_roughness = g(n, "scalars", "wood_groove_roughness", 0),
                            o.wood_diffuse_lobe_weight = g(n, "scalars", "wood_diffuse_lobe_weight", 0),
                            o.wood_curly_distortion_enable = g(n, "booleans", "wood_curly_distortion_enable", 0),
                            o.wood_curly_distortion_scale = g(n, "scalars", "wood_curly_distortion_scale", 0),
                            s.wood_curly_distortion_map = j(n, "scalars", "wood_curly_distortion_map", null),
                        z || q(),
                            o.uniforms.permutationMap.value = z.permutation,
                            o.uniforms.gradientMap.value = z.gradient,
                            o.uniforms.perm2DMap.value = z.perm2D,
                            o.uniforms.permGradMap.value = z.permGrad;
                        break;
                    default:
                        THREE.warn("Unknown prism type: " + o.prismType)
                }
                o.enableImportantSampling && (o.surface_anisotropy || o.surface_rotation || o.layered_anisotropy || o.layered_rotation) && (y || p(), o.uniforms.importantSamplingRandomMap.value = y.randomNum, o.uniforms.importantSamplingSolidAngleMap.value = y.solidAngle),
                    o.defines = {},
                    o.textureMaps = {};
                for (var t in s) if (s[t]) {
                    var u = k[s[t]];
                    i = u.properties;
                    var v = "BumpMap" == u.definition ? "bumpmap_Bitmap": "unifiedbitmap_Bitmap",
                        w = i.uris[v].values[0];
                    w && (h = {
                        mapName: t,
                        uri: w,
                        textureObj: u,
                        isPrism: !0
                    },
                        o.textureMaps[h.mapName] = h, o.defines["USE_" + t.toUpperCase()] = "")
                }
                o.defines[o.prismType.toUpperCase()] = "",
                "PrismWood" == o.prismType && o.enable3DWoodBump && (o.defines.PRISMWOODBUMP = ""),
                o.enableImportantSampling && (o.defines.ENABLEIMPORTANTSAMPLING = ""),
                o.transparent && (o.lmv_depthWriteTransparent = !0, o.depthWrite = !!c)
            } else if (m && !b && "SimplePhong" == m.definition) {
                o.tag = m.tag,
                    o.proteinType = m.proteinType,
                void 0 === o.proteinType && (o.proteinType = null);
                var x = o.ambient = d(n, "generic_ambient"),
                    B = o.color = d(n, "generic_diffuse"),
                    C = o.specular = d(n, "generic_specular"),
                    D = o.emissive = d(n, "generic_emissive");
                o.shininess = e(n, "generic_glossiness", 30),
                    o.opacity = 1 - e(n, "generic_transparency", 0),
                    o.reflectivity = e(n, "generic_reflectivity_at_0deg", 0);
                var E = f(n, "generic_bump_is_normal"),
                    F = e(n, "generic_bump_amount", 0);
                null == F && (F = 1),
                    E ? (F > 1 && (F = 1), o.normalScale = new THREE.Vector2(F, F)) : (F >= 1 && (F = .03), o.bumpScale = F);
                var G = f(n, "generic_is_metal");
                void 0 !== G && (o.metal = G);
                var H = f(n, "generic_backface_cull");
                void 0 === H || H || (o.side = THREE.DoubleSide),
                    o.transparent = m.transparent,
                    o.textureMaps = {};
                var I = m.textures,
                    J = !1;
                for (var K in I) if (h = {},
                        h.textureObj = k[I[K].connections[0]], i = h.textureObj.properties, h.uri = i.uris.unifiedbitmap_Bitmap.values[0], h.uri) {
                    if ("generic_diffuse" == K) h.mapName = "map",
                    (!o.color || 0 === o.color.r && 0 === o.color.g && 0 === o.color.b) && o.color.setRGB(1, 1, 1);
                    else if ("generic_bump" == K) h.mapName = E ? "normalMap": "bumpMap";
                    else if ("generic_specular" == K) h.mapName = "specularMap";
                    else {
                        if ("generic_alpha" != K) continue;
                        h.mapName = "alphaMap",
                            o.side = THREE.DoubleSide,
                            o.transparent = !0,
                            J = !0
                    }
                    o.textureMaps[h.mapName] = h
                }
                0 === B.r && 0 === B.g && 0 === B.b && 0 === C.r && 0 === C.g && 0 === C.b && 0 === x.r && 0 === x.g && 0 === x.b && 0 === D.r && 0 === D.g && 0 === D.b && (B.r = B.g = B.b = .4),
                    o.extraDepthOffset = e(n, "generic_depth_offset"),
                o.extraDepthOffset && (o.polygonOffset = !0, o.polygonOffsetFactor = o.extraDepthOffset, o.polygonOffsetUnits = 0),
                o.transparent && (o.opacity >= 1 ? J || (o.transparency = !1) : (o.lmv_depthWriteTransparent = !0, o.depthWrite = !!c))
            } else o.ambient = 197379,
                o.color = 7829367,
                o.specular = 3355443,
                o.shininess = 30,
                o.shading = THREE.SmoothShading;
            return o
        }
        function t(a, b, c) {
            var d = a.properties;
            b.clampS = !g(d, "booleans", "texture_URepeat", !1),
                b.clampT = !g(d, "booleans", "texture_VRepeat", !1),
                b.wrapS = b.clampS ? THREE.ClampToEdgeWrapping: THREE.RepeatWrapping,
                b.wrapT = b.clampT ? THREE.ClampToEdgeWrapping: THREE.RepeatWrapping,
                b.matrix = o(d, c),
            "UnifiedBitmap" == a.definition && (b.invert = g(d, "booleans", "unifiedbitmap_Invert", !1)),
            "BumpMap" == a.definition && (b.bumpmapType = g(d, "choicelists", "bumpmap_Type", 0), b.bumpScale = n(d, b.bumpmapType, c))
        }
        function u(a, b) {
            if (a) {
                var c = a.properties;
                b.invert = f(c, "unifiedbitmap_Invert"),
                    b.clampS = !f(c, "texture_URepeat", !0),
                    b.clampT = !f(c, "texture_VRepeat", !0),
                    b.wrapS = b.clampS ? THREE.ClampToEdgeWrapping: THREE.RepeatWrapping,
                    b.wrapT = b.clampT ? THREE.ClampToEdgeWrapping: THREE.RepeatWrapping;
                var d = e(c, "texture_UScale", 1),
                    g = e(c, "texture_VScale", 1),
                    h = e(c, "texture_UOffset", 0),
                    i = e(c, "texture_VOffset", 0),
                    j = e(c, "texture_WAngle", 0);
                b.matrix = {
                    elements: [Math.cos(j) * d, Math.sin(j) * g, 0, -Math.sin(j) * d, Math.cos(j) * g, 0, h, i, 1]
                }
            }
        }
        function v(a, b, c, d) {
            d ? t(a, b, c) : u(a, b)
        }
        function w(a) {
            var b = a.materials,
                c = b[a.userassets[0]];
            if (c) {
                var d = c.definition;
                return "PrismLayered" == d || "PrismMetal" == d || "PrismOpaque" == d || "PrismTransparent" == d || "PrismWood" == d
            }
            return ! 1
        }
        function x(a, b) {
            var c = new THREE.MeshPhongMaterial;
            c.packedNormals = !0,
                c.textureMaps = {};
            var d = a.values,
                e = d.diffuse;
            if (e) if (Array.isArray(e)) c.color = new THREE.Color(e[0], e[1], e[2]);
            else if ("string" == typeof e) {
                c.color = new THREE.Color(1, 1, 1);
                var f = {};
                f.mapName = "map";
                var g = b.gltf.textures[e];
                f.uri = g.source,
                    f.flipY = !1,
                    c.textureMaps[f.mapName] = f
            }
            var h = d.specular;
            return h && (c.specular = new THREE.Color(h[0], h[1], h[2])),
            d.shininess && (c.shininess = d.shininess),
                c.reflectivity = 0,
                c.transparent = !1,
                c
        }
        var y, z, A = c(91),
            B = {
                MilliMeter: 1e3,
                mm: 1e3,
                8206 : 1e3,
                DeciMeter: 10,
                dm: 10,
                8204 : 10,
                CentiMeter: 100,
                cm: 100,
                8205 : 100,
                Meter: 1,
                m: 1,
                8193 : 1,
                KiloMeter: .001,
                km: .001,
                8201 : .001,
                Inch: 39.37008,
                in:39.37008,
                8214 : 39.37008,
                Foot: 3.28084,
                ft: 3.28084,
                8215 : 3.28084,
                Mile: 62137e-8,
                mi: 62137e-8,
                8225 : 62137e-8,
                Yard: 1.09361,
                yard: 1.09361,
                8221 : 1.09361
            };
        a.exports = {
            convertMaterial: s,
            convertTexture: v,
            isPrismMaterial: w,
            convertMaterialGltf: x
        }
    },
    function(a, b, c) {
        "use strict";
        var d = {
                uniforms: {
                    tDiffuse: {
                        type: "t",
                        value: null
                    },
                    cameraNear: {
                        type: "f",
                        value: 1
                    },
                    cameraInvNearFar: {
                        type: "f",
                        value: 100
                    },
                    resolution: {
                        type: "v2",
                        value: new THREE.Vector2(1 / 512, 1 / 512)
                    }
                },
                vertexShader: c(123),
                fragmentShader: c(124)
            },
            e = {
                uniforms: {
                    tDiffuse: {
                        type: "t",
                        value: null
                    },
                    resolution: {
                        type: "v2",
                        value: new THREE.Vector2(1 / 512, 1 / 512)
                    }
                },
                vertexShader: c(125),
                fragmentShader: c(126)
            };
        a.exports = {
            SAOMinifyFirstShader: d,
            SAOMinifyShader: e
        }
    },
    function(a, b) {
        a.exports = "\r\n\r\nvoid main() {\r\n\r\n\r\n    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\r\n\r\n}\r\n"
    },
    function(a, b) {
        a.exports = "uniform sampler2D tDiffuse;\r\nuniform vec2 resolution;\r\nuniform float cameraNear;\r\nuniform float cameraInvNearFar;\r\n\r\n\r\n\r\n#include<pack_depth>\r\n\r\nvoid main() {\r\n\r\n\r\n\r\n\r\n\r\n\r\n    vec2 ssP = vec2(gl_FragCoord.xy);\r\n    ssP = ssP * 2.0 + mod(ssP, 2.0);\r\n    ssP = (ssP + 0.5) * resolution * 0.5;\r\n\r\n\r\n    float depth = texture2D(tDiffuse, ssP).z;\r\n\r\n    if (depth != 0.0)\r\n        depth = (depth + cameraNear) * cameraInvNearFar;\r\n    gl_FragColor = packDepth(depth);\r\n\r\n}\r\n"
    },
    function(a, b) {
        a.exports = "\r\n\r\nvoid main() {\r\n\r\n\r\n    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\r\n\r\n}\r\n"
    },
    function(a, b) {
        a.exports = "uniform sampler2D tDiffuse;\r\nuniform vec2 resolution;\r\n\r\n\r\n\r\nvoid main() {\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n    vec2 ssP = vec2(gl_FragCoord.xy);\r\n    ssP = ssP * 2.0 + mod(ssP, 2.0);\r\n    ssP = (ssP + 0.5) * resolution * 0.5;\r\n    gl_FragColor = texture2D(tDiffuse, ssP);\r\n\r\n\r\n\r\n}\r\n"
    },
    function(a, b) {
        "use strict";
        var c = new Float32Array(1),
            d = new Uint32Array(c.buffer),
            e = new Uint16Array(1),
            f = new Uint16Array(1),
            g = function(a) {
                c[0] = a;
                var b = d[0],
                    g = 0;
                if (0 == (2147483647 & b)) f[g++] = b >> 16;
                else {
                    var h = 2147483648 & b,
                        i = 2139095040 & b,
                        j = 8388607 & b;
                    if (0 === i) f[g++] = h >> 16;
                    else if (2139095040 == i) f[g++] = 0 === j ? h >> 16 | 31744 : 65024;
                    else {
                        var k, l, m = h >> 16,
                            n = (0 | i >> 23) - 127 + 15;
                        n >= 31 ? f[g++] = h >> 16 | 31744 : n <= 0 ? (14 - n > 24 ? k = 0 : (j |= 8388608, k = j >> 14 - n, e[0] = k, k = e[0], j >> 13 - n & 1 && (k += 1)), f[g++] = m | k) : (l = n << 10, e[0] = l, l = e[0], k = j >> 13, e[0] = k, k = e[0], f[g++] = 4096 & j ? 1 + (m | l | k) : m | l | k)
                    }
                }
                return f[0]
            },
            h = function(a) {
                var b, e = 65535 & a;
                if (0 == (32767 & e)) b = e << 16;
                else {
                    var f = 32768 & e,
                        g = 31744 & e,
                        h = 1023 & e;
                    if (0 === g) {
                        var i = -1;
                        do {
                            i++, h <<= 1
                        } while ( 0 == ( 1024 & h ));
                        var j = f << 16,
                            k = (g << 16 >> 26) - 15 + 127 - i,
                            l = k << 23,
                            m = (1023 & h) << 13;
                        b = j | l | m
                    } else 31744 == g ? b = 0 === h ? f << 16 | 2139095040 : 4290772992 : (j = f << 16, k = (g << 16 >> 26) - 15 + 127, l = k << 23, m = h << 13, b = j | l | m)
                }
                return d[0] = b,
                    c[0]
            },
            i = function(a) {
                if (a > 59389 || a < 0) return THREE.log("out of range"),
                    g(NaN);
                if (0 === a) return 0;
                var b = !1;
                a > 29694 && (b = !0, a -= 29694);
                var c = 0 | Math.abs(a / 1024),
                    d = Math.pow(2, c - 13),
                    e = d + (a - 1024 * c) * d / 1024;
                return b && (e = -e),
                    g(e)
            },
            j = function(a) {
                if (0 === a) return 0;
                var b = h(a),
                    c = !1;
                b < 0 && (c = !0, b = -b);
                var d = 0 | Math.floor(Math.log(b) / Math.log(2)),
                    e = Math.pow(2, d),
                    f = (b - e) / e * 1024 + 1024 * (d + 13);
                return c && (f += 29694),
                    f
            },
            k = function() {
                for (var a = [ - 1 / 255, -.17, -75, -1789, -.005], b = 0; b < a.length; b++) THREE.log("input", a[b], "encoded", g(a[b]), "decoded", h(g(a[b])));
                for (var b = 0; b < 59390; b++) {
                    var c = j(i(b));
                    c !== b && THREE.log("Roundtrip failed for", b, c)
                }
            };
        a.exports = {
            FloatToHalf: g,
            HalfToFloat: h,
            IntToHalf: i,
            HalfToInt: j,
            HalfTest: k
        }
    },
    function(a, b) {
        "use strict";
        function c(a, b, c) {
            this.nodeAccess = a,
                this.maxDepth = c,
                this.objectCount = b,
                this.numHidden = 0,
                this.numOff = 0
        }
        var d = {
            LEAF_OBJECT: 0,
            FIRST_OBJECT: 1,
            LAST_OBJECT: 2
        };
        c.prototype.setFlagNode = function(a, b, c) {
            var d = this.nodeAccess.getNodeFlags(a);
            return !! (d & b) != c && (c ? this.nodeAccess.setNodeFlags(a, d | b) : this.nodeAccess.setNodeFlags(a, d & ~b), !0)
        },
            c.prototype.setFlagGlobal = function(a, b) {
                var c = this.nodeAccess,
                    d = 0,
                    e = c.numNodes;
                if (b) for (; d < e; d++) c.setNodeFlags(d, c.getNodeFlags(d) | a);
                else for (var f = ~a; d < e; d++) c.setNodeFlags(d, c.getNodeFlags(d) & f)
            },
            c.prototype.setNodeOff = function(a, b) {
                var c = this.setFlagNode(a, 1073741824, b);
                return c && (b ? this.numOff++:this.numOff--),
                    c
            },
            c.prototype.isNodeOff = function(a) {
                return !! (1073741824 & this.nodeAccess.getNodeFlags(a))
            },
            c.prototype.setNodeHidden = function(a, b) {
                var c = this.setFlagNode(a, 2147483648, b);
                return c && (b ? this.numHidden++:this.numHidden--),
                    c
            },
            c.prototype.isNodeHidden = function(a) {
                return !! (2147483648 & this.nodeAccess.getNodeFlags(a))
            },
            c.prototype.getNodeType = function(a) {
                return 7 & this.nodeAccess.getNodeFlags(a)
            },
            c.prototype.isNodeSelectable = function(a) {
                return ! (536870912 & this.nodeAccess.getNodeFlags(a))
            },
            c.prototype.getNodeParentId = function(a) {
                return this.nodeAccess.getParentId(a)
            },
            c.prototype.getRootId = function() {
                return this.nodeAccess.rootId
            },
            c.prototype.getNodeName = function(a) {
                return this.nodeAccess.name(a)
            },
            c.prototype.getChildCount = function(a) {
                return this.nodeAccess.getNumChildren(a)
            },
            c.prototype.getNodeBox = function(a, b) {
                this.nodeAccess.getNodeBox(a, b)
            },
            c.prototype.enumNodeFragments = function(a, b, c) {
                function d(a) {
                    f.nodeAccess.enumNodeFragments(a, b),
                    c && f.enumNodeChildren(a,
                        function(a) {
                            d(a)
                        })
                }
                var e;
                "number" == typeof a ? e = a: a && (e = a.dbId);
                var f = this;
                d(e)
            },
            c.prototype.enumNodeChildren = function(a, b, c) {
                function d(a) {
                    f.nodeAccess.enumNodeChildren(a,
                        function(a) {
                            b(a),
                            c && d(a)
                        })
                }
                var e;
                "number" == typeof a ? e = a: a && (e = a.dbId);
                var f = this;
                c && b(e),
                    d(e)
            },
            c.prototype.findNodeForSelection = function(a, b) {
                if (b === d.LEAF_OBJECT) return a;
                var c, e, f = a;
                if (b === d.FIRST_OBJECT) {
                    var g = [];
                    for (c = a; c;) g.push(c),
                        c = this.getNodeParentId(c);
                    for (var h = g.length - 1; h >= 0; h--) if (5 !== (e = this.getNodeType(g[h])) && 2 !== e && 3 !== e) {
                        f = g[h];
                        break
                    }
                } else if (b === d.LAST_OBJECT) for (c = a; c;) {
                    if (4 === (e = this.getNodeType(c))) {
                        f = c;
                        break
                    }
                    c = this.getNodeParentId(c)
                }
                return f
            },
            a.exports = {
                InstanceTree: c,
                SelectionMode: d
            }
    },
    function(a, b) {
        "use strict";
        function c(a) {
            this.numOffs = 0,
                this.numHidden = 0;
            var b, c = {}; !
                function(a) {
                    function d(b) {
                        for (var c = 0,
                                 d = a.length; c < d; c++) {
                            var e = a[c];
                            Array.isArray(e) || (g[0] = e, e = g);
                            for (var f = 0; f < e.length; f++) b(c, e[f])
                        }
                    }
                    var e = 0,
                        f = [],
                        g = [0];
                    d(function(a, b) {
                        var d = c[b];
                        void 0 === d && (c[b] = d = f.length, f.push(0), f.push(0)),
                            ++f[d],
                            ++e
                    }),
                        b = new Uint32Array(e + f.length / 2),
                        b.fill(0);
                    var h, i, j = 0;
                    for (h in c) {
                        i = c[h];
                        var k = f[i],
                            l = j + k + 1;
                        b[j] = k,
                            f[i] = f[i + 1] = j,
                            j = l
                    }
                    var m = !1;
                    d(function(a, d) {
                        var e = c[d],
                            g = f[e + 1] + 1;
                        g > b.length || b[g] ? m || (console.error("DbidFragmentMap.buildMap: Internal error fragment overlap"), m = !0) : (b[g] = a, f[e + 1] = g)
                    }),
                        m = !1;
                    for (h in c) {
                        i = c[h];
                        var n = f[i + 1] + 1;
                        n < b.length && !b[n] && (m || (console.error("DbidFragmentMap.buildMap: Internal error fragment underfilled"), m = !0))
                    }
                    for (h in c) i = c[h],
                        c[h] = f[i]
                } (a),
                this.setFlagNode = function(a, d, e) {
                    if (!c.hasOwnProperty(a)) return ! 1;
                    var f = c[a];
                    return !! (b[f] & d) != e && (e ? b[f] |= d: b[f] &= ~d, !0)
                },
                this.setNodeOff = function(a, b) {
                    var c = this.setFlagNode(a, d, b);
                    return c && (b ? this.numOff++:this.numOff--),
                        c
                },
                this.isNodeOff = function(a) {
                    var e = c[a];
                    return !! (b[e] & d)
                },
                this.setNodeHidden = function(a, b) {
                    var c = this.setFlagNode(a, e, b);
                    return c && (b ? this.numHidden++:this.numHidden--),
                        c
                },
                this.isNodeHidden = function(a) {
                    var d = c[a];
                    return !! (b[d] & e)
                },
                this.getRootId = function() {
                    return g
                },
                this.enumNodeFragments = function(a, d) {
                    var e;
                    "number" == typeof a ? e = a: a && (e = a.dbId);
                    for (var g = c[e], h = (b[g] & f) + g + 1; ++g < h;) d(b[g], e)
                },
                this.enumNodeChildren = function(a, b, d) {
                    if (d && b(a), a == g) for (var e in c) b(Number(e))
                }
        }
        var d = 16777216,
            e = 33554432,
            f = 16777215,
            g = -1 << 30;
        a.exports = {
            DbidFragmentMap: c
        }
    },
    function(a, b) {
        "use strict";
        function c(a, b) {
            this.nodes = [],
                this.nextNode = 0,
                this.children = [],
                this.nextChild = 0,
                this.dbIdToIndex = {},
                this.names = [],
                this.s2i = {},
                this.strings = [],
                this.nameSuffixes = [],
                this.getIndex(0)
        }
        function d(a) {
            var b = new Int32Array(a.length);
            return b.set(a),
                b
        }
        function e(a, b, c) {
            this.nodes = a.nodes,
                this.children = a.children,
                this.dbIdToIndex = a.dbIdToIndex,
                this.names = a.names,
                this.nameSuffixes = a.nameSuffixes,
                this.strings = a.strings,
                this.rootId = b,
                this.numNodes = this.nodes.length / f,
                this.visibleIds = null,
                this.nodeBoxes = c || new Float32Array(6 * this.numNodes)
        }
        var f = 5;
        c.prototype.getIndex = function(a) {
            var b = this.dbIdToIndex[a];
            if (b) return b;
            b = this.nextNode++,
                this.nodes.push(a);
            for (var c = 1; c < f; c++) this.nodes.push(0);
            return this.dbIdToIndex[a] = b,
                b
        },
            c.prototype.setNode = function(a, b, c, d, e, g) {
                var h = this.getIndex(a),
                    i = h * f,
                    j = e.length,
                    k = g && g.length;
                k && (j += g.length),
                    this.nodes[i + 1] = b,
                    this.nodes[i + 2] = this.nextChild,
                    this.nodes[i + 3] = k ? -j: j,
                    this.nodes[i + 4] = d;
                var l;
                for (l = 0; l < e.length; l++) this.children[this.nextChild++] = this.getIndex(e[l]);
                if (k) for (l = 0; l < g.length; l++) this.children[this.nextChild++] = -g[l] - 1;
                this.nextChild > this.children.length && console.error("Child index out of bounds -- should not happen"),
                    this.processName(h, c)
            },
            c.prototype.processName = function(a, b) {
                var c, d, e = -1,
                    f = -1;
                if (b && (f = b.lastIndexOf("]"), -1 !== (e = b.lastIndexOf("[")) && -1 !== f || (e = b.lastIndexOf(":"), f = b.length)), e >= 0 && f > e) {
                    c = b.slice(0, e + 1);
                    var g = b.slice(e + 1, f);
                    d = parseInt(g, 10),
                    d && d + "" === g || (c = b, d = 0)
                } else c = b,
                    d = 0;
                var h = this.s2i[c];
                void 0 === h && (this.strings.push(c), h = this.strings.length - 1, this.s2i[c] = h),
                    this.names[a] = h,
                    this.nameSuffixes[a] = d
            },
            c.prototype.flatten = function(a, b, c, e, f, g) {
                this.nodes = d(this.nodes),
                    this.children = d(this.children),
                    this.names = d(this.names),
                    this.nameSuffixes = d(this.nameSuffixes),
                    this.s2i = null
            },
            e.prototype.getNumNodes = function(a) {
                return this.numNodes
            },
            e.prototype.getIndex = function(a) {
                return this.dbIdToIndex[a]
            },
            e.prototype.name = function(a) {
                var b = this.dbIdToIndex[a],
                    c = this.strings[this.names[b]],
                    d = this.nameSuffixes[b];
                if (d) {
                    return "[" === c.charAt(c.length - 1) ? c + d + "]": c + d
                }
                return c
            },
            e.prototype.getParentId = function(a) {
                return this.nodes[this.dbIdToIndex[a] * f + 1]
            },
            e.prototype.getNodeFlags = function(a) {
                return this.nodes[this.dbIdToIndex[a] * f + 4]
            },
            e.prototype.setNodeFlags = function(a, b) {
                this.nodes[this.dbIdToIndex[a] * f + 4] = b
            },
            e.prototype.getNumChildren = function(a) {
                var b = this.dbIdToIndex[a],
                    c = this.nodes[b * f + 3];
                if (c >= 0) return c;
                var d = this.nodes[b * f + 2];
                c = Math.abs(c);
                for (var e = 0,
                         g = 0; g < c; g++) {
                    if (this.children[d + g] < 0) break;
                    e++
                }
                return e
            },
            e.prototype.getNumFragments = function(a) {
                var b = this.dbIdToIndex[a],
                    c = this.nodes[b * f + 3];
                if (c >= 0) return 0;
                var d = this.nodes[b * f + 2];
                c = Math.abs(c);
                for (var e = 0,
                         g = c - 1; g >= 0; g--) {
                    if (this.children[d + g] >= 0) break;
                    e++
                }
                return e
            },
            e.prototype.getNodeBox = function(a, b) {
                for (var c = 6 * this.getIndex(a), d = 0; d < 6; d++) b[d] = this.nodeBoxes[c + d]
            },
            e.prototype.getVisibleIds = function() {
                return this.visibleIds || (this.visibleIds = Object.keys(this.dbIdToIndex).map(function(a) {
                    return parseInt(a)
                })),
                    this.visibleIds
            },
            e.prototype.enumNodeChildren = function(a, b) {
                var c = this.dbIdToIndex[a],
                    d = this.nodes[c * f + 2],
                    e = this.nodes[c * f + 3];
                e = Math.abs(e);
                for (var g = 0; g < e; g++) {
                    var h = this.children[d + g];
                    if (h < 0) break;
                    b(this.nodes[h * f + 0], a, c)
                }
            },
            e.prototype.enumNodeFragments = function(a, b) {
                var c = this.dbIdToIndex[a],
                    d = this.nodes[c * f + 2],
                    e = this.nodes[c * f + 3];
                if (e < 0) {
                    e = -e;
                    for (var g = 0; g < e; g++) {
                        var h = this.children[d + g];
                        h > 0 || b( - h - 1, a, c)
                    }
                }
            },
            e.prototype.computeBoxes = function(a) {
                function b(a, b, c) {
                    var f = e.getIndex(a);
                    d(a, f);
                    for (var h = 6 * c,
                             i = 6 * f,
                             j = 0; j < 3; j++) g[h + j] > g[i + j] && (g[h + j] = g[i + j]),
                    g[h + j + 3] < g[i + j + 3] && (g[h + j + 3] = g[i + j + 3])
                }
                function c(b, c, d) {
                    for (var e = 6 * b,
                             f = 6 * d,
                             h = 0; h < 3; h++) g[f + h] > a[e + h] && (g[f + h] = a[e + h]),
                    g[f + h + 3] < a[e + h + 3] && (g[f + h + 3] = a[e + h + 3])
                }
                function d(a, d) {
                    var f = 6 * d;
                    g[f] = g[f + 1] = g[f + 2] = 1 / 0,
                        g[f + 3] = g[f + 4] = g[f + 5] = -1 / 0,
                    e.getNumChildren(a) && e.enumNodeChildren(a, b, !0),
                    e.getNumFragments(a) && e.enumNodeFragments(a, c)
                }
                var e = this,
                    f = e.getIndex(e.rootId),
                    g = e.nodeBoxes;
                d(e.rootId, f)
            },
            a.exports = {
                InstanceTreeStorage: c,
                InstanceTreeAccess: e
            }
    },
    function(a, b) {
        "use strict";
        function c(a, b) {
            this.bytes_per_node = b ? 32 : 36;
            var c, d;
            a instanceof ArrayBuffer ? (c = a.byteLength / this.bytes_per_node, d = a, this.nodeCount = c) : (c = 0 | a, d = new ArrayBuffer(this.bytes_per_node * c), this.nodeCount = 0),
                this.nodeCapacity = c,
                this.nodesRaw = d,
                this.is_lean_node = b,
                this.node_stride = this.bytes_per_node / 4,
                this.node_stride_short = this.bytes_per_node / 2,
                this.nodesF = new Float32Array(this.nodesRaw),
                this.nodesI = new Int32Array(this.nodesRaw),
                this.nodesS = new Uint16Array(this.nodesRaw)
        }
        function d(a, b) {
            this.boxes = a.boxes,
                this.polygonCounts = a.polygonCounts,
                this.hasPolygonCounts = !!this.polygonCounts,
                this.materials = a.materials,
                this.materialDefs = b,
                this.count = a.length,
                this.boxStride = 6
        }
        function e(a, b, c) {
            this.finfo = c || new d(a, b),
                this.prim_count = this.finfo.getCount(),
                this.frags_per_leaf_node = -1,
                this.frags_per_inner_node = -1,
                this.nodes = null,
                this.work_buf = new ArrayBuffer(4 * this.prim_count),
                this.sort_prims = new Int32Array(this.work_buf),
                this.primitives = new Int32Array(this.prim_count),
                this.centroids = new Float32Array(f * this.prim_count),
                this.boxv_o = new Float32Array(6),
                this.boxc_o = new Float32Array(6),
                this.boxv_t = new Float32Array(6),
                this.boxc_t = new Float32Array(6),
                this.recursion_stack = []
        }
        c.prototype.setLeftChild = function(a, b) {
            this.nodesI[a * this.node_stride + 6] = b
        },
            c.prototype.getLeftChild = function(a) {
                return this.nodesI[a * this.node_stride + 6]
            },
            c.prototype.setPrimStart = function(a, b) {
                this.is_lean_node ? this.nodesI[a * this.node_stride + 6] = b: this.nodesI[a * this.node_stride + 8] = b
            },
            c.prototype.getPrimStart = function(a) {
                return this.is_lean_node ? this.nodesI[a * this.node_stride + 6] : this.nodesI[a * this.node_stride + 8]
            },
            c.prototype.setPrimCount = function(a, b) {
                this.nodesS[a * this.node_stride_short + 14] = b
            },
            c.prototype.getPrimCount = function(a) {
                return this.nodesS[a * this.node_stride_short + 14]
            },
            c.prototype.setFlags = function(a, b, c, d) {
                this.nodesS[a * this.node_stride_short + 15] = d << 3 | c << 2 | 3 & b
            },
            c.prototype.getFlags = function(a) {
                return this.nodesS[a * this.node_stride_short + 15]
            },
            c.prototype.setBox0 = function(a, b) {
                var c = a * this.node_stride,
                    d = this.nodesF;
                d[c] = b[0],
                    d[c + 1] = b[1],
                    d[c + 2] = b[2],
                    d[c + 3] = b[3],
                    d[c + 4] = b[4],
                    d[c + 5] = b[5]
            },
            c.prototype.getBoxThree = function(a, b) {
                var c = a * this.node_stride,
                    d = this.nodesF;
                b.min.x = d[c],
                    b.min.y = d[c + 1],
                    b.min.z = d[c + 2],
                    b.max.x = d[c + 3],
                    b.max.y = d[c + 4],
                    b.max.z = d[c + 5]
            },
            c.prototype.setBoxThree = function(a, b) {
                var c = a * this.node_stride,
                    d = this.nodesF;
                d[c] = b.min.x,
                    d[c + 1] = b.min.y,
                    d[c + 2] = b.min.z,
                    d[c + 3] = b.max.x,
                    d[c + 4] = b.max.y,
                    d[c + 5] = b.max.z
            },
            c.prototype.makeEmpty = function(a) {
                var b = a * this.node_stride,
                    c = this.nodesI;
                c[b + 6] = -1,
                    c[b + 7] = 0,
                this.is_lean_node || (c[b + 8] = -1)
            },
            c.prototype.realloc = function(a) {
                if (this.nodeCount + a > this.nodeCapacity) {
                    var b = 0 | 3 * this.nodeCapacity / 2;
                    b < this.nodeCount + a && (b = this.nodeCount + a);
                    var c = new ArrayBuffer(b * this.bytes_per_node),
                        d = new Int32Array(c);
                    d.set(this.nodesI),
                        this.nodeCapacity = b,
                        this.nodesRaw = c,
                        this.nodesF = new Float32Array(c),
                        this.nodesI = d,
                        this.nodesS = new Uint16Array(c)
                }
            },
            c.prototype.nextNodes = function(a) {
                this.realloc(a);
                var b = this.nodeCount;
                this.nodeCount += a;
                for (var c = 0; c < a; c++) this.makeEmpty(b + c);
                return b
            },
            c.prototype.getRawData = function() {
                return this.nodesRaw.slice(0, this.nodeCount * this.bytes_per_node)
            };
        var f = 3,
            g = 1e-5,
            h = 1e-5,
            i = 15,
            j = 16,
            k = function() {
                function a(a, b, c, d) {
                    a[b] = .5 * (c[d] + c[d + 3]),
                        a[b + 1] = .5 * (c[d + 1] + c[d + 4]),
                        a[b + 2] = .5 * (c[d + 2] + c[d + 5])
                }
                function b(a, b, c) {
                    a[0] > b[c] && (a[0] = b[c]),
                    a[3] < b[c] && (a[3] = b[c]),
                    a[1] > b[c + 1] && (a[1] = b[c + 1]),
                    a[4] < b[c + 1] && (a[4] = b[c + 1]),
                    a[2] > b[c + 2] && (a[2] = b[c + 2]),
                    a[5] < b[c + 2] && (a[5] = b[c + 2])
                }
                function c(a, b, c) {
                    a[0] > b[c] && (a[0] = b[c]),
                    a[1] > b[c + 1] && (a[1] = b[c + 1]),
                    a[2] > b[c + 2] && (a[2] = b[c + 2]),
                    a[3] < b[c + 3] && (a[3] = b[c + 3]),
                    a[4] < b[c + 4] && (a[4] = b[c + 4]),
                    a[5] < b[c + 5] && (a[5] = b[c + 5])
                }
                function d(a, b) {
                    a[0] > b[0] && (a[0] = b[0]),
                    a[1] > b[1] && (a[1] = b[1]),
                    a[2] > b[2] && (a[2] = b[2]),
                    a[3] < b[3] && (a[3] = b[3]),
                    a[4] < b[4] && (a[4] = b[4]),
                    a[5] < b[5] && (a[5] = b[5])
                }
                function e(a, b, c, d) {
                    for (var e = 0; e < 3; e++) a[b + e] = c[d + 3 + e] - c[d + e]
                }
                function f(a, b) {
                    a[0] = b[0],
                        a[1] = b[1],
                        a[2] = b[2],
                        a[3] = b[3],
                        a[4] = b[4],
                        a[5] = b[5]
                }
                function k(a) {
                    a[0] = w,
                        a[1] = w,
                        a[2] = w,
                        a[3] = -w,
                        a[4] = -w,
                        a[5] = -w
                }
                function l(a, b) {
                    var c = a[b + 3] - a[b],
                        d = a[b + 4] - a[b + 1],
                        e = a[b + 5] - a[b + 2];
                    return c < 0 || d < 0 || e < 0 ? 0 : 2 * (c * d + d * e + e * c)
                }
                function m(a) {
                    var b = a[3] - a[0],
                        c = a[4] - a[1],
                        d = a[5] - a[2];
                    return b < 0 || c < 0 || d < 0 ? 0 : 2 * (b * c + c * d + d * b)
                }
                function n() {
                    this.vb_left = new Float32Array(6),
                        this.vb_right = new Float32Array(6),
                        this.cb_left = new Float32Array(6),
                        this.cb_right = new Float32Array(6),
                        this.num_left = 0,
                        this.best_split = -1,
                        this.best_cost = -1,
                        this.num_bins = -1
                }
                function o() {
                    this.box_bbox = new Float32Array(6),
                        this.box_centroid = new Float32Array(6),
                        this.num_prims = 0
                }
                function p() {
                    this.BL = new Float32Array(6),
                        this.CL = new Float32Array(6),
                        this.NL = 0,
                        this.AL = 0
                }
                function q(a, d, e, f, g, i, j) {
                    for (var k = a.centroids,
                             l = a.primitives,
                             m = a.finfo.boxes,
                             n = a.finfo.boxStride,
                             o = j * (1 - h) / i[f], p = g[f], q = a.sort_prims, r = d; r <= e; r++) {
                        var s = 0 | l[r],
                            t = o * (k[3 * s + f] - p),
                            u = 0 | t;
                        u < 0 ? u = 0 : u >= j && (u = j - 1),
                            q[r] = u,
                            y[u].num_prims++,
                            c(y[u].box_bbox, m, s * n),
                            b(y[u].box_centroid, k, 3 * s)
                    }
                }
                function r(a, b, c, e, g, h, i) {
                    if (h[e] < a.scene_epsilon) return void(i.best_cost = 1 / 0);
                    var k = j;
                    k > c - b + 1 && (k = c - b + 1);
                    var l;
                    for (l = 0; l < k; l++) y[l].reset();
                    for (l = 0; l < k - 1; l++) z[l].reset();
                    i.num_bins = k,
                        q(a, b, c, e, g, h, k),
                        f(z[0].BL, y[0].box_bbox),
                        f(z[0].CL, y[0].box_centroid),
                        z[0].AL = m(z[0].BL),
                        z[0].NL = y[0].num_prims;
                    var n;
                    for (l = 1; l < k - 1; l++) {
                        n = y[l];
                        var o = z[l];
                        f(o.BL, z[l - 1].BL),
                            d(o.BL, n.box_bbox),
                            o.AL = m(o.BL),
                            f(o.CL, z[l - 1].CL),
                            d(o.CL, n.box_centroid),
                            o.NL = z[l - 1].NL + n.num_prims
                    }
                    l = k - 1,
                        f(A, y[l].box_bbox),
                        f(B, y[l].box_centroid);
                    var p = m(A),
                        r = y[l].num_prims,
                        s = l,
                        t = p * r + z[l - 1].AL * z[l - 1].NL;
                    for (f(i.vb_right, A), f(i.cb_right, y[l].box_centroid), f(i.vb_left, z[l - 1].BL), f(i.cb_left, z[l - 1].CL), i.num_left = z[l - 1].NL, l -= 1; l >= 1; l--) {
                        n = y[l],
                            d(A, n.box_bbox),
                            d(B, n.box_centroid),
                            p = m(A),
                            r += n.num_prims;
                        var u = p * r + z[l - 1].AL * z[l - 1].NL;
                        u <= t && (t = u, s = l, f(i.vb_right, A), f(i.cb_right, B), f(i.vb_left, z[l - 1].BL), f(i.cb_left, z[l - 1].CL), i.num_left = z[l - 1].NL)
                    }
                    i.best_split = s,
                        i.best_cost = t
                }
                function s(a, b, c, d, e, f, g) {
                    var h, i, j = a.primitives,
                        k = a.sort_prims,
                        l = 0,
                        m = 0 | b,
                        n = 0 | g.best_split;
                    for (h = b; h <= c; h++) {
                        var o = 0 | j[h];
                        k[h] < n ? j[m++] = o: k[l++] = o
                    }
                    for (i = 0; i < l; i++) j[m + i] = k[i]
                }
                function t(a, c, d, f, g, h, i, j) {
                    var l = a.primitives,
                        m = a.centroids,
                        n = g - f + 1;
                    n > a.frags_per_inner_node && (n = a.frags_per_inner_node),
                    n > j && (n = j),
                        c.setPrimStart(d, f),
                        c.setPrimCount(d, n),
                        f += n,
                        k(h);
                    for (var o = f; o <= g; o++) b(h, m, 3 * l[o]);
                    e(i, 0, h, 0);
                    var p = 0;
                    return i[1] > i[0] && (p = 1),
                    i[2] > i[p] && (p = 2),
                        p
                }
                function u(a, b, c, d, f, g, h, j) {
                    e(C, 0, g, 0);
                    var k = a.nodes,
                        l = h ? a.frags_per_leaf_node_transparent: a.frags_per_leaf_node,
                        m = h ? a.frags_per_inner_node_transparent: a.frags_per_inner_node,
                        o = a.max_polys_per_node,
                        p = 0;
                    C[1] > C[0] && (p = 1),
                    C[2] > C[p] && (p = 2),
                        k.setBox0(b, f);
                    var q = 0,
                        u = 0,
                        v = d - c + 1;
                    if (a.finfo.hasPolygonCounts && a.frags_per_inner_node) for (var w = v <= a.frags_per_inner_node ? d: c + a.frags_per_inner_node - 1, x = c; x <= w && (q += a.finfo.getPolygonCount(a.primitives[x]), u++, !(q > o)); x++);
                    if (v <= l && q < o || 1 === v || j > i || C[p] < a.scene_epsilon) return k.setLeftChild(b, -1),
                        k.setPrimStart(b, c),
                        k.setPrimCount(b, d - c + 1),
                        void k.setFlags(b, 0, 0, h ? 1 : 0);
                    m && (p = t(a, k, b, c, d, g, C, u), c += k.getPrimCount(b));
                    var y = new n;
                    if (r(a, c, d, p, g, C, y), y.num_bins < 0) return void k.setPrimCount(b, k.getPrimCount(b) + d - c + 1);
                    s(a, c, d, p, g, C, y);
                    var z = k.nextNodes(2),
                        A = .5 * (y.vb_left[3 + p] + y.vb_left[p]),
                        B = .5 * (y.vb_right[3 + p] + y.vb_right[p]);
                    k.setFlags(b, p, A < B ? 0 : 1, h ? 1 : 0),
                        k.setLeftChild(b, z),
                        a.recursion_stack.push([a, z + 1, c + y.num_left, d, y.vb_right, y.cb_right, h, j + 1]),
                        a.recursion_stack.push([a, z, c, c + y.num_left - 1, y.vb_left, y.cb_left, h, j + 1])
                }
                function v(d) {
                    var f = d.boxv_o,
                        h = d.boxc_o,
                        i = d.boxv_t,
                        j = d.boxc_t;
                    k(f),
                        k(h),
                        k(i),
                        k(j);
                    for (var l = d.centroids,
                             m = d.finfo.boxes,
                             n = d.finfo.boxStride,
                             o = 0,
                             p = d.prim_count; o < p; o++) {
                        var q = d.primitives[o];
                        a(l, 3 * q, m, n * q),
                            o >= d.first_transparent ? (b(j, l, 3 * q), c(i, m, n * q)) : (b(h, l, 3 * q), c(f, m, n * q))
                    }
                    e(C, 0, d.boxv_o, 0);
                    var r = Math.max(C[0], C[1], C[2]);
                    d.scene_epsilon = g * r
                }
                var w = 1 / 0;
                n.prototype.reset = function() {
                    this.num_left = 0,
                        this.best_split = -1,
                        this.best_cost = -1,
                        this.num_bins = -1
                },
                    o.prototype.reset = function() {
                        this.num_prims = 0,
                            k(this.box_bbox),
                            k(this.box_centroid)
                    },
                    p.prototype.reset = function() {
                        this.NL = 0,
                            this.AL = 0,
                            k(this.BL),
                            k(this.CL)
                    };
                var x, y = [];
                for (x = 0; x < j; x++) y.push(new o);
                var z = [];
                for (x = 0; x < j - 1; x++) z.push(new p);
                var A = new Float32Array(6),
                    B = new Float32Array(6),
                    C = new Float32Array(3);
                return {
                    bvh_subdivide: u,
                    compute_boxes: v,
                    box_area: l
                }
            } ();
        d.prototype.getCount = function() {
            return this.count
        },
            d.prototype.isTransparent = function(a) {
                return ! (!this.materialDefs || !this.materialDefs[this.materials[a]]) && this.materialDefs[this.materials[a]].transparent
            },
            d.prototype.getPolygonCount = function(a) {
                return this.polygonCounts[a]
            },
            e.prototype.sortPrimitives = function() {
                var a, b, c = new Float32Array(this.work_buf),
                    d = this.primitives,
                    e = 0;
                for (a = 0, b = this.prim_count; a < b; a++) {
                    d[a] = a;
                    var f = this.finfo.isTransparent(a);
                    f && e++,
                        c[a] = k.box_area(this.finfo.boxes, this.finfo.boxStride * a),
                    f && (c[a] = -c[a])
                }
                Array.prototype.sort.call(this.primitives,
                    function(a, b) {
                        return c[b] - c[a]
                    }),
                    this.first_transparent = this.prim_count - e
            },
            e.prototype.build = function(a) {
                function b(b, c) {
                    a.hasOwnProperty(b) ? e[b] = a[b] : e[b] = c
                }
                var d = a && !!a.useSlimNodes,
                    e = this;
                if (d) b("frags_per_leaf_node", 1),
                    b("frags_per_inner_node", 0),
                    b("frags_per_leaf_node_transparent", 1),
                    b("frags_per_inner_node_transparent", 0),
                    b("max_polys_per_node", 1 / 0);
                else {
                    var f = a.isWeakDevice ? .5 : 1;
                    b("frags_per_leaf_node", 0 | 32 * f),
                        b("frags_per_inner_node", 0 | this.frags_per_leaf_node),
                        b("frags_per_leaf_node_transparent", this.frags_per_leaf_node),
                        b("frags_per_inner_node_transparent", 0),
                        b("max_polys_per_node", 0 | 1e4 * f)
                }
                if (this.nodes && this.nodes.is_lean_node == d) this.nodes.nodeCount = 0;
                else {
                    for (var g = this.prim_count / this.frags_per_leaf_node,
                             h = 1; h < g;) h *= 2;
                    this.nodes = new c(h, !!a && a.useSlimNodes)
                }
                this.sortPrimitives(),
                    k.compute_boxes(this);
                var i = this.nodes.nextNodes(2);
                k.bvh_subdivide(this, i, 0, this.first_transparent - 1, this.boxv_o, this.boxc_o, !1, 0);
                for (var j; this.recursion_stack.length;) j = this.recursion_stack.pop(),
                    k.bvh_subdivide(j[0], j[1], j[2], j[3], j[4], j[5], j[6], j[7]);
                for (k.bvh_subdivide(this, i + 1, this.first_transparent, this.prim_count - 1, this.boxv_t, this.boxc_t, !0, 0); this.recursion_stack.length;) j = this.recursion_stack.pop(),
                    k.bvh_subdivide(j[0], j[1], j[2], j[3], j[4], j[5], j[6], j[7])
            },
            a.exports = {
                NodeArray: c,
                BVHBuilder: e
            }
    }]);
"undefined" != typeof module && module.exports && (module.exports = WGS);
