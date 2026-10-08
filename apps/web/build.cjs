const webpack=require('webpack'),fs=require('fs'),path=require('path');
const cache=path.resolve('.cache/webpack');
console.log('Fixture precompile cache present: '+fs.existsSync(path.join(cache,'fixture/index.pack')));
const compiler=webpack({mode:'development',target:'node',devtool:false,entry:path.resolve('entry.js'),output:{path:path.resolve('dist'),filename:'bundle.js',library:{type:'commonjs2'}},cache:{type:'filesystem',cacheDirectory:cache,name:'fixture',buildDependencies:{config:[__filename]}},infrastructureLogging:{level:'verbose',debug:/PackFileCacheStrategy/}});
compiler.run((error,stats)=>{
 if(error||stats.hasErrors()){console.error(error||stats.toString());process.exitCode=1;return compiler.close(()=>{});}
 console.log(stats.toString({all:false,timings:true,cachedModules:true,modules:true}));
 const shared=require('./dist/bundle.js'),marker=process.env.FIXTURE_MARKER||'default';
 fs.writeFileSync('dist/index.html','<!doctype html><title>Generic workspace cache</title><h1>'+shared+'</h1><p>'+marker+'</p>');
 fs.writeFileSync('arvumi/functions/build-result.json',JSON.stringify({shared,marker}));
 compiler.close(error=>{if(error){console.error(error);process.exitCode=1;}});
});
