#!/usr/bin

test -z `which docker` && echo "docker不存在，请先安装 docker" 1>&2 && exit 1

dockhost=$2
group=$3
baseImage=$4
name=$5
optionTag=$6

tag=`date +%Y-%m-%d-%H-%M-%S`

imageLatestTag=$dockhost/$group/$name:latest
imageTimeTag=$dockhost/$group/$name:$tag
imageOptionTag=$dockhost/$group/$name:$optionTag

# 重写Dockerfile
echoDockerfile() {
 echo "FROM $baseImage" > Dockerfile
 echo "COPY . /data/$name/" >> Dockerfile
 echo "WORKDIR /data/$name/" >> Dockerfile
 echo "CMD [\"sh\", \"run.sh\"]" >> Dockerfile
}

# 上传镜像
uploadImage() {
  if [ -z $optionTag ]; then
    docker push $imageTimeTag
  else
    docker push $imageOptionTag
  fi
}

# 创建镜像
buildImage() {
  # 重写Dockerfile
  echoDockerfile
  # 构建镜像
  if [ -z "$optionTag" ] ; then
    echo $imageTimeTag
    docker build -t $imageTimeTag . &&
    echo $imageTimeTag > .dockrc &&
    # 上传镜像
    uploadImage
  else
    echo $imageOptionTag
    docker build -t $imageOptionTag . &&
    # 输出镜像地址
    echo $imageOptionTag > .dockrc &&
    # 上传镜像
    uploadImage
  fi
}
# 运行镜像
run() {
  imageName=`cat ./.dockrc`
  docker run -it --rm  -e env=test -e PORT0=9000 -p 9000:9000  $imageName
}

if [ $1 ] && [ $1 == "run" ]; then
   run
fi

if [ $1 ] && [ $1 == "build" ]; then
   buildImage
fi

if [ $1 ] && [ $1 == "info" ]; then
   echo $imageTimeTag 
fi