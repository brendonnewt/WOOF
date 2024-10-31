package petadoption.api.recommendations;

import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@Log4j2
@RestController
@RequestMapping("/api/recommendations")
@CrossOrigin(origins = { "http://localhost:3000", "http://35.184.141.85:3000" })
public class RecommendationsController {
    @Autowired
    RecommendationsService recommendationsService;

    @GetMapping("/{userId}")
    public MappedInteractionHistory fetch(@PathVariable Long userId){
        return recommendationsService.findByUser(userId);
    }

    @PutMapping("/{userId}/like/{animalId}")
    public HttpStatus likeAnimal(@PathVariable Long userId, @PathVariable Long animalId) throws Exception {
        try {
            recommendationsService.likeAnimal(userId, animalId);
            return HttpStatus.OK;
        } catch (Exception e){
            log.error(e.getMessage());
            e.printStackTrace();
            return HttpStatus.BAD_REQUEST;
        }
    }
    @PutMapping("/{userId}/dislike/{animalId}")
    public HttpStatus dislikeAnimal(@PathVariable Long userId, @PathVariable Long animalId) throws Exception {
        try {
            recommendationsService.dislikeAnimal(userId, animalId);
            return HttpStatus.OK;
        } catch (Exception e){
            log.error(e.getMessage());
            e.printStackTrace();
            return HttpStatus.BAD_REQUEST;
        }
    }

}
