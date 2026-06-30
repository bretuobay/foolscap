import postcssNesting from 'postcss-nesting'
import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'

export default {
  plugins: [
    postcssNesting(),
    autoprefixer(),
    ...(process.env.NODE_ENV === 'production' ? [cssnano()] : []),
  ],
}
