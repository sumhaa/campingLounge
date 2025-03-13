package com.project01_teamA.camping_lounge.service.camp;

import com.project01_teamA.camping_lounge.entity.camp.CampImageFiles;
import com.project01_teamA.camping_lounge.entity.camp.CampThumbFiles;
import com.project01_teamA.camping_lounge.repository.review.ReviewRepository;
import com.project01_teamA.camping_lounge.repository.camp.CampImagesRepository;
import com.project01_teamA.camping_lounge.repository.camp.CampThumbRepository;
import com.project01_teamA.camping_lounge.repository.reservation.ReservationRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.project01_teamA.camping_lounge.dto.request.camp.CampUpdateDto;
import com.project01_teamA.camping_lounge.dto.request.camp.CampWriteDto;
import com.project01_teamA.camping_lounge.dto.response.camp.ResCampDetailDto;
import com.project01_teamA.camping_lounge.dto.response.camp.ResCampListDto;
import com.project01_teamA.camping_lounge.dto.response.camp.ResCampWriteDto;
import com.project01_teamA.camping_lounge.entity.camp.Campsite;
import com.project01_teamA.camping_lounge.exception.ResourceNotFoundException;
import com.project01_teamA.camping_lounge.repository.camp.CampRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.DefaultUriBuilderFactory;

import java.io.IOException;
import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CampService {
    private final CampRepository campRepository;
    private final CampImagesService campImagesService;
    private final CampThumbService campThumbService;
    private final CampThumbRepository campThumbRepository;
    private final CampImagesRepository campImagesRepository;
    private final ReservationRepository reservationRepository;
    private final ReviewRepository reviewRepository;

    //오픈 api 서비스키
    @Value("${openApi.serviceKey}")
    private String serviceKey;

    //전체 조회
    public Page<ResCampListDto> getAllCamps(Pageable pageable) {
        Page<Campsite> camps = campRepository.findAll(pageable);
        List<ResCampListDto> list = camps.getContent().stream()
                .map(ResCampListDto::fromEntity)
                .collect(Collectors.toList());
        return new PageImpl<>(list, pageable, camps.getTotalElements());
    }

    //검색 필터 기능
    public Page<ResCampListDto> getFilteredCamps(String search, List<String> filters, Pageable pageable) {
        return campRepository.findFilteredCamps(search, filters, pageable);
    }

    //캠핑장 상세
    public ResCampDetailDto detail(Long campId) {
        Campsite findCamp = campRepository.findById(campId).orElseThrow(
                () -> new ResourceNotFoundException("Camp", "Camp Id", String.valueOf(campId))
        );
        findCamp.upViewCount();
        return ResCampDetailDto.fromEntity(findCamp);
    }

    //캠핑장 등록
    public ResCampWriteDto write(CampWriteDto campDto) throws IOException {
        Campsite campsite = CampWriteDto.ofEntity(campDto);
        Campsite savedCamp = campRepository.save(campsite);
        if (campDto.getThumb() != null && !campDto.getThumb().isEmpty()) {
            campThumbService.upload(savedCamp.getId(), campDto.getThumb());
        }
        if (campDto.getImages() != null && !campDto.getImages().isEmpty()) {
            campImagesService.upload(savedCamp.getId(), campDto.getImages());
        }
        return ResCampWriteDto.fromEntity(savedCamp);
    }
    
    //캠핑장 수정
    public ResCampDetailDto update(Long campId, CampUpdateDto campDTO) {
        Campsite updateCamp = campRepository.findById(campId).orElseThrow(
                () -> new ResourceNotFoundException("Camp", "Camp Id", String.valueOf(campId))
        );
        updateCamp.update(campDTO.getCampName(), campDTO.getCampInfo(), campDTO.getCampTel(), campDTO.getCampAddressDo(), campDTO.getCampAddressGungu(), campDTO.getCampAddress1(), campDTO.getCampAddress2(), campDTO.getCampMapX(), campDTO.getCampMapY(),campDTO.getToilet(),campDTO.getHotWater(),campDTO.getElectric(),campDTO.getFireWood(),campDTO.getWifi(),campDTO.getPlayGround(),campDTO.getPet(),campDTO.getSwimming(),campDTO.getTotalCapacity());
        return ResCampDetailDto.fromEntity(updateCamp);
    }

//    //체크한 캠핑장 삭제
//    public void deleteChecked(List<Long> campId) {
//        campRepository.deleteAllByIdInBatch(campId);
//    }
    //캠핑장 상세에서 삭제
    public void delete(Long campId) {
        campRepository.deleteById(campId);
    }


    public void CampDataFromOpenApi(Long rowNum){
//-------------------------캠핑장, 썸네일 가져오기
        //api 연결
        //서비스키를 인코딩하는 과정에서 계속 인코딩 오류가 생겨 uri빌더 활용
        //참고 https://life.photogrammer.me/openapi-servicekey-encoding-problem/
        System.out.println();
        final var builder = new DefaultUriBuilderFactory();
        builder.setEncodingMode(DefaultUriBuilderFactory.EncodingMode.NONE);
        final String uriString = builder.builder()
                .scheme("http")
                .host("apis.data.go.kr")
                .path("B551011/GoCamping/basedList")
                .queryParam( "serviceKey",serviceKey)
                .queryParam("numOfRows",rowNum)
                .queryParam("pageNo",1)
                .queryParam("MobileOS","ETC")
                .queryParam("MobileApp","CampingLounge")
                .queryParam("_type","json")
                .build()
                .toString();
        //String url = "serviceKey=WdKxg24/1qg/JFhv/RL3VThehr/+Tuso1S/MWbI+uPr7hUGZWV9iGDnAOA+UJ0P4A8AN4DsjXC5uwWuDFqd7yw==
        // &numOfRows=10
        // &pageNo=1
        // &MobileOS=ETC
        // &MobileApp=CampingLounge
        // &_type=json";
        final URI uri = URI.create(uriString);
        //System.out.println(uri);
        try {
           

            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<String> response = restTemplate.getForEntity(uri, String.class);
            
            String jsonString = response.getBody();
//            System.out.println(response.getBody());
            
            //json 데이터를 자바 객체(캠프엔티티)로 매핑
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode root = objectMapper.readTree(jsonString);

            //고캠핑 제이슨데이터의 구성요소(메뉴얼 참고)
            JsonNode items = root
                    .path("response")
                    .path("body")
                    .path("items")
                    .path("item");

            List<Campsite> campsiteList = new ArrayList<>();
            List<CampThumbFiles> thumbList = new ArrayList<>();
            List<CampImageFiles> imageList = new ArrayList<>();


            for(JsonNode item : items){
                Random random = new Random();

                //데이터 일부 가공
                String sbrsCl = item.path("sbrsCl").asText("");
                String posblFcltyCl = item.path("posblFcltyCl").asText("");
                String animalCmgCl = item.path("animalCmgCl").asText("");
                String lineIntro = item.path("lineIntro").asText();
                String intro = item.path("intro").asText();
                String featureNm = item.path("featureNm").asText();
                String tooltip = item.path("tooltip").asText();
                String campInfo = lineIntro + intro + featureNm + tooltip;

                //해당 정보들이 문자열로 되어있어서 boolean으로 변환
                boolean hotWater =  sbrsCl.contains("온수");
                boolean electric = sbrsCl.contains("전기");
                boolean firewood = sbrsCl.contains("장작판매");
                boolean wifi = sbrsCl.contains("무선인터넷");
                boolean playGround = posblFcltyCl.contains("운동장");
                boolean pet = animalCmgCl.equals("가능");
                boolean swimming = posblFcltyCl.contains("물놀이");

                //캠프엔티티에 빌더로 매핑
                Campsite camp = Campsite.builder()
                        .campName(item.path("facltNm").asText())
                        .campInfo(campInfo)
                        .campTel(item.path("tel").asText())
                        .campAddressDo(item.path("doNm").asText())
                        .campAddressGungu(item.path("sigunguNm").asText())
                        .campAddress1(item.path("addr1").asText())
                        .campAddress2(item.path("addr2").asText())
                        .campMapX(item.path("mapX").asText())
                        .campMapY(item.path("mapY").asText())
                        .toilet(item.path("toiletCo").asInt())
                        .hotWater(hotWater)
                        .electric(electric)
                        .fireWood(firewood)
                        .wifi(wifi)
                        .playGround(playGround)
                        .pet(pet)
                        .swimming(swimming)
                        .totalCapacity(random.nextInt(70)+30) //총 자리수가 json에 없어서 랜덤으로 생성 30~100
                        .campHit(0)
                        .campLike(0)
                        .apiContentId(item.path("contentId").asText())
                        .build();
                campsiteList.add(camp);
                
                //썸네일 저장
                if(!item.path("firstImageUrl").asText().isEmpty()){
                    //확장자 추출
                    String fileUrl = item.path("firstImageUrl").asText();
                    int typeIndex = fileUrl.lastIndexOf(".");
                    String fileType = fileUrl.substring(typeIndex+1);

                    CampThumbFiles thumb = CampThumbFiles.builder()
                            .originalFileName("Thumbnail_" + item.path("facltNm").asText())
                            .filePath(fileUrl)
                            .fileType(fileType)
                            .build();
                    thumb.setMappingCamp(camp);
                    thumbList.add(thumb);
                }

                //api 연결
                //서비스키를 인코딩하는 과정에서 계속 인코딩 오류가 생겨 uri빌더 활용

                final var imageUrlbuilder = new DefaultUriBuilderFactory();
                imageUrlbuilder.setEncodingMode(DefaultUriBuilderFactory.EncodingMode.NONE);
                final String ImageUriString = builder.builder()
                        .scheme("http")
                        .host("apis.data.go.kr")
                        .path("B551011/GoCamping/imageList")
                        .queryParam( "serviceKey",serviceKey)
                        .queryParam("numOfRows",8)
                        .queryParam("pageNo",1)
                        .queryParam("MobileOS","ETC")
                        .queryParam("MobileApp","CampingLounge")
                        .queryParam("contentId",item.path("contentId").asText())
                        .queryParam("_type","json")
                        .build()
                        .toString();

                final URI ImageUri = URI.create(ImageUriString);

                try {
                    RestTemplate imageRestTemplate = new RestTemplate();
                    ResponseEntity<String> imageResponse = imageRestTemplate.getForEntity(ImageUri, String.class);

                    String imageJsonString = imageResponse.getBody();

                    //json 데이터를 자바 객체(캠프엔티티)로 매핑
                    ObjectMapper imageObjectMapper = new ObjectMapper();
                    JsonNode imageRoot = imageObjectMapper.readTree(imageJsonString);

                    //고캠핑 제이슨데이터의 구성요소(메뉴얼 참고)
                    JsonNode imageItems = imageRoot
                            .path("response")
                            .path("body")
                            .path("items")
                            .path("item");

                    for(JsonNode imageItem : imageItems){
                        //확장자 추출
                        String fileUrl = imageItem.path("imageUrl").asText();
                        int typeIndex = fileUrl.lastIndexOf(".");
                        String fileType = fileUrl.substring(typeIndex+1);

                        CampImageFiles images = CampImageFiles.builder()
                                .originalFileName("image_" + item.path("facltNm").asText() + imageItem.path("serialnum").asText())
                                .filePath(imageItem.path("imageUrl").asText())
                                .fileType(fileType)
                                .build();
                        images.setMappingCamp(camp);
                        imageList.add(images);
                    }
                }catch (Exception e) {
                    e.printStackTrace();
                    System.err.println("고캠핑 공공 API 이미지 목록 조회에 실패했습니다.");
                }
            }
            campRepository.saveAll(campsiteList);
            campThumbRepository.saveAll(thumbList);
            campImagesRepository.saveAll(imageList);


//-------------------------상세 이미지 목록 가져오기
        }catch (Exception e) {
            e.printStackTrace();
            System.err.println("고캠핑 공공 API 연동에 실패했습니다.");
        }

    }

    public ResCampDetailDto upLikeCount(Long campId) {
        Campsite findCamp = campRepository.findById(campId).orElseThrow(
                () -> new ResourceNotFoundException("Camp", "Camp Id", String.valueOf(campId))
        );
        findCamp.upLikeCount();
        return ResCampDetailDto.fromEntity(findCamp);
    }

    public ResCampDetailDto downLikeCount(Long campId) {
        Campsite findCamp = campRepository.findById(campId).orElseThrow(
                () -> new ResourceNotFoundException("Camp", "Camp Id", String.valueOf(campId))
        );
        findCamp.downLikeCount();
        return ResCampDetailDto.fromEntity(findCamp);
    }
}
