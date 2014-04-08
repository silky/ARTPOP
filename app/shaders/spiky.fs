/*http://threejs.org/examples/webgl_custom_attributes.html*/

varying vec3 vNormal;
varying vec2 vUv;

uniform vec3 color;
uniform sampler2D texture;

void main() {
	vec3 light = vec3( 0.5, 0.2, 1.0 );

	//threejs
	light = normalize( light );

	float dProd = dot( vNormal, light ) 
					* 0.5 
					+ 0.5;

	vec4 tcolor = texture2D( texture, vUv );

	vec4 gray = vec4( 
					vec3( tcolor.r * 0.5 + tcolor.g * 0.59 + tcolor.b * 0.11 )
				,
					1.0
				);

	gl_FragColor =  gray 
					* 
					vec4(
						  vec3( dProd )
						* vec3( color )
					,
						1.0
					);

}

















/**/